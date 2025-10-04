import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Send } from "lucide-react";

const messageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío").max(1000, "El mensaje no puede exceder 1000 caracteres")
});

type MessageData = z.infer<typeof messageSchema>;

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  senderName: string;
  isStaff: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

const statusColors = {
  open: "bg-green-500/20 text-green-400 border-green-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  closed: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusLabels = {
  open: "Abierto",
  in_progress: "En Progreso",
  resolved: "Resuelto",
  closed: "Cerrado"
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<MessageData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: ""
    }
  });

  // Fetch ticket and messages
  const { data: ticketData, isLoading } = useQuery({
    queryKey: ['/api/tickets', id],
    queryFn: async () => {
      const response = await fetch(`/api/tickets/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Error al cargar el ticket');
      }
      return response.json();
    },
    enabled: !!id
  });

  // Set initial messages when data loads
  useEffect(() => {
    if (ticketData?.messages) {
      setMessages(ticketData.messages);
    }
  }, [ticketData]);

  // WebSocket connection
  useEffect(() => {
    if (!id) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      // Authenticate
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('sessionId='))
        ?.split('=')[1];

      if (sessionId) {
        websocket.send(JSON.stringify({
          type: 'auth',
          sessionId
        }));
      }
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'auth_success') {
          // Subscribe to ticket
          websocket.send(JSON.stringify({
            type: 'subscribe',
            ticketId: id
          }));
        } else if (data.type === 'new_message') {
          // Add new message to list
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'error') {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [id, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageData) => {
      return await apiRequest(`/api/tickets/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/tickets', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al enviar el mensaje",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: MessageData) => {
    sendMessageMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <main className="container mx-auto px-6 py-16">
          <div className="text-center text-gray-400">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const ticket = ticketData?.ticket as Ticket;

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <main className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ticket no encontrado</h2>
            <Button onClick={() => navigate('/soporte')} data-testid="button-back-to-support">
              Volver a Soporte
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <Header />
      
      <main className="container mx-auto px-6 py-8 flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 mb-4"
              onClick={() => navigate('/soporte')}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Soporte
            </Button>
            
            <Card className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg border-blue-500/20 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-ticket-title">{ticket.title}</h1>
                  <p className="text-gray-300 mb-4">{ticket.description}</p>
                  <div className="flex gap-3 items-center flex-wrap">
                    <Badge className={statusColors[ticket.status as keyof typeof statusColors]} data-testid={`badge-status-${ticket.status}`}>
                      {statusLabels[ticket.status as keyof typeof statusLabels]}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Creado: {format(new Date(ticket.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
                {ticket.imageUrl && (
                  <img
                    src={ticket.imageUrl}
                    alt="Captura del ticket"
                    className="w-32 h-32 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-6 overflow-y-auto mb-6" data-testid="chat-messages-container">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No hay mensajes todavía. ¡Sé el primero en enviar uno!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        msg.senderId === user?.id
                          ? 'bg-blue-600/30 border border-blue-500/30'
                          : msg.isStaff
                          ? 'bg-purple-600/30 border border-purple-500/30'
                          : 'bg-gray-700/50 border border-gray-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-semibold ${
                          msg.isStaff ? 'text-purple-400' : 'text-blue-400'
                        }`}>
                          {msg.senderName}
                        </span>
                        {msg.isStaff && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            Soporte
                          </Badge>
                        )}
                      </div>
                      <p className="text-white whitespace-pre-wrap">{msg.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <Card className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg border-blue-500/20 p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Escribe tu mensaje..."
                          className="bg-gray-800/50 border-gray-600 text-white resize-none"
                          rows={2}
                          data-testid="textarea-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white self-end"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
