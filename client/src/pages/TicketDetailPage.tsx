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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Send, CheckCircle2, XCircle, User, Calendar, Shield, Ban, Paperclip } from "lucide-react";
import { VIP_LABELS, VIP_COLORS, ROLE_LABELS, ROLE_COLORS } from "@shared/schema";

const messageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío").max(1000, "El mensaje no puede exceder 1000 caracteres")
});

type MessageData = z.infer<typeof messageSchema>;

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  imageUrl?: string;
  isSystemMessage?: boolean;
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
  assignedTo?: string;
  assignedUserInfo?: {
    username: string;
    role: string;
  };
  imageUrl?: string;
  createdAt: string;
}

interface TicketOwner {
  id: string;
  username: string;
  email: string;
  role: string;
  coins: number;
  vipLevel: number;
  isBanned: boolean;
  banReason?: string;
  lastLogin?: string;
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
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'auth_success') {
          // Subscribe to ticket after authentication
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

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-ticket-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      setUploadedImageUrl(data.url);
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageData & { imageUrl?: string }) => {
      const response = await fetch(`/api/tickets/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar el mensaje');
      }
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      setUploadedImageUrl(null);
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
    sendMessageMutation.mutate({
      ...data,
      imageUrl: uploadedImageUrl || undefined
    });
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const ticket = ticketData?.ticket as Ticket;
  const ticketOwner = ticketData?.ticketOwner as TicketOwner;

  // Take ticket mutation
  const takeTicketMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/tickets/${id}/take`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Asignado",
        description: "El ticket ha sido asignado a ti"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al tomar el ticket",
        variant: "destructive"
      });
    }
  });

  // Close ticket mutation
  const closeTicketMutation = useMutation({
    mutationFn: async (resolved: boolean) => {
      const response = await apiRequest('PATCH', `/api/tickets/${id}/close`, { resolved });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Cerrado",
        description: "El ticket ha sido cerrado exitosamente"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets', id] });
      setShowCloseDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al cerrar el ticket",
        variant: "destructive"
      });
    }
  });

  const isStaff = user && user.role !== 'player';
  const isAssignedToMe = ticket && ticket.assignedTo === user?.id;
  const canTakeTicket = isStaff && ticket?.status === 'open' && !ticket?.assignedTo;
  const canCloseTicket = isStaff && isAssignedToMe && (ticket?.status === 'open' || ticket?.status === 'in_progress');

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
      
      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Back Button - More Visible */}
          <div className="mb-8 mt-4">
            <Button
              variant="outline"
              className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-300 font-semibold"
              onClick={() => navigate('/soporte')}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver a Soporte
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex gap-6">
            {/* Left Side - Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Ticket Header */}
              <Card className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg border-blue-500/20 p-6 mb-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="text-sm text-gray-400 font-medium">Título:</span>
                      <h1 className="text-2xl font-bold text-white mt-1" data-testid="text-ticket-title">{ticket.title}</h1>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm text-gray-400 font-medium">Descripción:</span>
                      <p className="text-gray-300 mt-1">{ticket.description}</p>
                    </div>
                    
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
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </Card>

              {/* Support Assigned Indicator (visible to players only) */}
              {!isStaff && (
                <Card className="bg-gradient-to-r from-purple-900/20 via-purple-800/10 to-purple-900/20 backdrop-blur-lg border-purple-500/20 p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-purple-300/70 font-medium">Atendido por</span>
                      {ticket.assignedTo && ticket.assignedUserInfo ? (
                        <p className="text-purple-200 font-semibold">
                          Soporte #{ticket.assignedTo.slice(-4).toUpperCase()}
                        </p>
                      ) : (
                        <p className="text-purple-300/50 text-sm italic">
                          Esperando asignación de soporte...
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Chat Messages */}
              <div className="flex-1 bg-gradient-to-br from-gray-900/50 via-black/40 to-gray-900/50 backdrop-blur-xl border border-cyan-500/10 rounded-2xl overflow-hidden mb-6 flex flex-col" data-testid="chat-messages-container">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-cyan-400" />
                      </div>
                      <p className="text-gray-400 text-center">No hay mensajes todavía.</p>
                      <p className="text-gray-500 text-sm text-center mt-1">¡Inicia la conversación!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      // System message styling
                      if (msg.isSystemMessage) {
                        return (
                          <div
                            key={msg.id}
                            className="flex justify-center animate-in fade-in duration-300"
                            data-testid={`message-${msg.id}`}
                          >
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 max-w-[85%]">
                              <p className="text-yellow-300 text-sm text-center font-medium">
                                {msg.message}
                              </p>
                              <span className="text-[10px] text-yellow-500/60 block text-center mt-1">
                                {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      const isCurrentUser = msg.senderId === user?.id;
                      const isTicketOwner = msg.senderId === ticket.userId;
                      
                      // Generate anonymous code (last 4 chars of sender ID)
                      const anonymousCode = msg.senderId.slice(-4).toUpperCase();
                      
                      // Capitalize first letter of username
                      const capitalizedName = msg.senderName.charAt(0).toUpperCase() + msg.senderName.slice(1);
                      
                      // Show anonymous codes based on user type
                      let displayName;
                      if (!isStaff) {
                        // Players see anonymous codes for everyone except themselves
                        if (isCurrentUser) {
                          displayName = capitalizedName;
                        } else if (msg.isStaff) {
                          displayName = `Soporte #${anonymousCode}`;
                        } else {
                          displayName = `Usuario #${anonymousCode}`;
                        }
                      } else {
                        // Staff sees real names
                        displayName = capitalizedName;
                      }
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                          data-testid={`message-${msg.id}`}
                        >
                          <div className={`max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            {/* Sender Info */}
                            <div className="flex items-center gap-2 px-1">
                              <span className={`text-xs font-medium ${
                                msg.isStaff 
                                  ? 'text-purple-400' 
                                  : isTicketOwner 
                                  ? 'text-cyan-400' 
                                  : 'text-gray-400'
                              }`}>
                                {displayName}
                              </span>
                              {msg.isStaff && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] px-1.5 py-0">
                                  Soporte
                                </Badge>
                              )}
                              {isTicketOwner && !msg.isStaff && (
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px] px-1.5 py-0">
                                  Usuario
                                </Badge>
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div
                              className={`rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 hover:shadow-xl ${
                                msg.isStaff
                                  ? 'bg-gradient-to-br from-purple-600/30 to-purple-700/20 border border-purple-500/30 hover:border-purple-500/50'
                                  : isTicketOwner
                                  ? 'bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-500/50'
                                  : 'bg-gradient-to-br from-gray-700/40 to-gray-800/30 border border-gray-600/30 hover:border-gray-600/50'
                              }`}
                            >
                              <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                              {msg.imageUrl && (
                                <div className="mt-2">
                                  {msg.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video controls className="max-w-full rounded-lg">
                                      <source src={msg.imageUrl} />
                                    </video>
                                  ) : (
                                    <img
                                      src={msg.imageUrl}
                                      alt="Adjunto"
                                      className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => window.open(msg.imageUrl, '_blank')}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Timestamp */}
                            <span className="text-[11px] text-gray-500 px-1">
                              {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <Card className="bg-gradient-to-br from-gray-900/60 via-black/50 to-gray-900/60 backdrop-blur-xl border border-cyan-500/10 p-5 shadow-2xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    {/* Image Preview */}
                    {uploadedImageUrl && (
                      <div className="relative inline-block">
                        {uploadedImageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video controls className="max-h-32 rounded-lg border border-cyan-500/30">
                            <source src={uploadedImageUrl} />
                          </video>
                        ) : (
                          <img
                            src={uploadedImageUrl}
                            alt="Preview"
                            className="max-h-32 rounded-lg border border-cyan-500/30"
                          />
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => setUploadedImageUrl(null)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-3 items-end">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                                className="bg-gray-800/60 border-gray-600/50 text-white resize-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 rounded-xl transition-all"
                                rows={2}
                                data-testid="textarea-message"
                                onKeyDown={handleKeyDown}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        data-testid="input-file"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-800/60 border-gray-600/50 hover:bg-gray-700/60 text-gray-300 h-10 w-10 p-0 rounded-xl"
                        data-testid="button-attach-image"
                        title="Adjuntar imagen o video"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-10 w-10 p-0 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
                        data-testid="button-send-message"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </Card>
            </div>

            {/* Right Side - Player Info Panel (Only visible to Staff) */}
            {isStaff && ticketOwner && (
              <div className="w-80 flex-shrink-0">
                <Card className="bg-gradient-to-br from-gray-900/60 via-black/50 to-gray-900/60 backdrop-blur-xl border border-purple-500/20 p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    Información del Jugador
                  </h2>

                  {/* VIP Level - Priority Display */}
                  <div className="mb-6">
                    <div className={`bg-gradient-to-r ${VIP_COLORS[ticketOwner.vipLevel as keyof typeof VIP_COLORS]} border rounded-lg p-4 text-center`}>
                      <div className="text-sm font-medium opacity-80 mb-1">Nivel VIP</div>
                      <div className="text-2xl font-bold">{VIP_LABELS[ticketOwner.vipLevel as keyof typeof VIP_LABELS]}</div>
                      <div className="text-xs mt-1 opacity-70">Prioridad: {ticketOwner.vipLevel > 0 ? 'Alta' : 'Normal'}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Username */}
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">Usuario</div>
                        <div className="text-white font-medium truncate" data-testid="text-player-username">
                          {ticketOwner.username.charAt(0).toUpperCase() + ticketOwner.username.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">Rol</div>
                        <div className={`bg-gradient-to-r ${ROLE_COLORS[ticketOwner.role as keyof typeof ROLE_COLORS]} border rounded-lg px-3 py-2 text-sm font-medium`} data-testid="text-player-role">
                          {ROLE_LABELS[ticketOwner.role as keyof typeof ROLE_LABELS] || ticketOwner.role}
                        </div>
                      </div>
                    </div>

                    {/* Account Created */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">Cuenta Creada</div>
                        <div className="text-white text-sm">
                          {format(new Date(ticketOwner.createdAt), "dd/MM/yyyy", { locale: es })}
                        </div>
                      </div>
                    </div>

                    {/* Last Login */}
                    {ticketOwner.lastLogin && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-400 mb-1">Último Acceso</div>
                          <div className="text-white text-sm">
                            {format(new Date(ticketOwner.lastLogin), "dd/MM/yyyy HH:mm", { locale: es })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ban Status */}
                    {ticketOwner.isBanned && (
                      <div className="flex items-start gap-3">
                        <Ban className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-400 mb-1">Estado</div>
                          <div className="text-red-400 font-medium">Baneado</div>
                          {ticketOwner.banReason && (
                            <div className="text-xs text-gray-400 mt-1">{ticketOwner.banReason}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for Staff */}
                  <div className="space-y-3 pt-6 border-t border-gray-700/50">
                    {canTakeTicket && (
                      <Button
                        onClick={() => takeTicketMutation.mutate()}
                        disabled={takeTicketMutation.isPending}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        data-testid="button-take-ticket"
                      >
                        Tomar Ticket
                      </Button>
                    )}
                    {canCloseTicket && (
                      <Button
                        onClick={() => setShowCloseDialog(true)}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        data-testid="button-close-ticket"
                      >
                        Cerrar Ticket
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Close Ticket Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Cerrar Ticket</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Se pudo resolver el problema del usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              onClick={() => closeTicketMutation.mutate(true)}
              disabled={closeTicketMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
              data-testid="button-resolved"
            >
              <CheckCircle2 className="h-4 w-4" />
              Sí, Resuelto
            </Button>
            <Button
              onClick={() => closeTicketMutation.mutate(false)}
              disabled={closeTicketMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 flex items-center gap-2"
              data-testid="button-not-resolved"
            >
              <XCircle className="h-4 w-4" />
              No, Cerrar sin Resolver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
