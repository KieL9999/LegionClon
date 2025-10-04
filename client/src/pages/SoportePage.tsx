import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const createTicketSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título no puede exceder 200 caracteres"),
  description: z.string().min(1, "La descripción es requerida"),
  category: z.string().min(1, "La categoría es requerida"),
  priority: z.string().min(1, "La prioridad es requerida"),
  imageUrl: z.string().optional()
});

type CreateTicketData = z.infer<typeof createTicketSchema>;

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
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

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30"
};

const priorityLabels = {
  low: "Baja",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente"
};

const categoryColors = {
  general: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  technical: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  account: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  billing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

const categoryLabels = {
  general: "General",
  technical: "Técnico",
  account: "Cuenta",
  billing: "Donaciones",
  other: "Otro"
};

export default function SoportePage() {
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const form = useForm<CreateTicketData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      priority: "normal",
      imageUrl: ""
    }
  });

  // Fetch user's tickets
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['/api/tickets'],
    enabled: isAuthenticated
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear ticket');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket creado",
        description: "Tu ticket ha sido creado exitosamente"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      setCreateTicketOpen(false);
      form.reset();
      setSelectedImage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el ticket",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: CreateTicketData) => {
    try {
      let imageUrl = "";
      
      // Upload image if one is selected
      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const response = await fetch('/api/upload-ticket-image', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }
        
        const result = await response.json();
        imageUrl = result.url;
        setUploadingImage(false);
      }
      
      // Create ticket with image URL if available
      createTicketMutation.mutate({
        ...data,
        imageUrl: imageUrl || undefined
      });
    } catch (error: any) {
      setUploadingImage(false);
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <span className="text-2xl">💬</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Centro de Soporte
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Equipo disponible 24/7</span>
            </div>
          </div>

          {/* Tickets Section for authenticated users */}
          {isAuthenticated && (
            <div className="mb-12 bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-400">Mis Tickets de Soporte</h2>
                <Dialog open={createTicketOpen} onOpenChange={setCreateTicketOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
                      data-testid="button-create-ticket"
                    >
                      Crear Nuevo Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-blue-500/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-blue-400 text-xl">Crear Nuevo Ticket de Soporte</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Título</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Describe brevemente tu problema..."
                                  className="bg-gray-800/50 border-gray-600 text-white"
                                  data-testid="input-ticket-title"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Categoría</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white" data-testid="select-ticket-category">
                                      <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="technical">Técnico</SelectItem>
                                    <SelectItem value="account">Cuenta</SelectItem>
                                    <SelectItem value="billing">Donaciones</SelectItem>
                                    <SelectItem value="other">Otro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Prioridad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white" data-testid="select-ticket-priority">
                                      <SelectValue placeholder="Selecciona la prioridad" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Descripción</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe tu problema con el mayor detalle posible..."
                                  className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                                  data-testid="textarea-ticket-description"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <label className="block text-white mb-2">Imagen (opcional)</label>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                              className="bg-gray-800/50 border-gray-600 text-white h-14 py-3 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
                              data-testid="input-ticket-image"
                            />
                            {selectedImage && (
                              <span className="text-sm text-gray-300">
                                {selectedImage.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Adjunta una captura de pantalla para ayudarnos a entender mejor el problema (máx. 5MB)</p>
                        </div>

                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            disabled={createTicketMutation.isPending || uploadingImage}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white flex-1"
                            data-testid="button-submit-ticket"
                          >
                            {uploadingImage ? "Subiendo imagen..." : createTicketMutation.isPending ? "Creando..." : "Crear Ticket"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateTicketOpen(false)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            data-testid="button-cancel-ticket"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tickets List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">Cargando tickets...</div>
                </div>
              ) : (tickets as any)?.tickets?.length > 0 ? (
                <div className="grid gap-4">
                  {((tickets as any)?.tickets || []).map((ticket: SupportTicket) => (
                    <Card key={ticket.id} className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg border-gray-700/50 shadow-lg hover:shadow-blue-500/20 transition-shadow" data-testid={`ticket-card-${ticket.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white text-lg font-semibold mb-3 truncate">{ticket.title}</h3>
                            <div className="flex flex-wrap gap-3 items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-400 font-medium">Estado:</span>
                                <Badge className={statusColors[ticket.status as keyof typeof statusColors]} data-testid={`status-${ticket.status}`}>
                                  {statusLabels[ticket.status as keyof typeof statusLabels]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-400 font-medium">Prioridad:</span>
                                <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]} data-testid={`priority-${ticket.priority}`}>
                                  {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-400 font-medium">Categoría:</span>
                                <Badge className={categoryColors[ticket.category as keyof typeof categoryColors]}>
                                  {categoryLabels[ticket.category as keyof typeof categoryLabels]}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs text-gray-500">📅</span>
                              <span className="text-sm font-medium text-blue-400">
                                {format(new Date(ticket.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 shrink-0"
                            data-testid={`button-view-ticket-${ticket.id}`}
                          >
                            Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎫</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No tienes tickets aún</h3>
                  <p className="text-gray-400 mb-6">Crea tu primer ticket de soporte para obtener ayuda con cualquier problema</p>
                </div>
              )}
            </div>
          )}

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* FAQ Section */}
            <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">❓</span>
                <h2 className="text-2xl font-bold text-blue-400">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Cómo creo una cuenta?</h3>
                  <p className="text-gray-300 text-sm">Haz clic en "Registro" en la parte superior de la página y completa el formulario con tus datos.</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Cómo descargo el cliente?</h3>
                  <p className="text-gray-300 text-sm">Ve a la sección "Descargar" en el menú principal para obtener la última versión del cliente.</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Problemas de conexión?</h3>
                  <p className="text-gray-300 text-sm">Verifica tu conexión a internet y asegúrate de tener la última versión del cliente instalada.</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📞</span>
                <h2 className="text-2xl font-bold text-cyan-400">Contactar Soporte</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-900/20 to-purple-800/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                    <span className="text-xl">💬</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Discord</h3>
                    <p className="text-gray-300 text-sm">Únete a nuestro servidor de Discord para soporte en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                    <span className="text-xl">📧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Email</h3>
                    <p className="text-gray-300 text-sm">soporte@aetherwow.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                    <span className="text-xl">🎫</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">Ticket de Soporte</h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">Activo</span>
                    </div>
                    <p className="text-gray-300 text-sm">Crea y gestiona tus tickets de soporte directamente desde tu cuenta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}