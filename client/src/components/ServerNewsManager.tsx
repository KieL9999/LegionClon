import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { insertServerNewsSchema, updateServerNewsSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, Link as LinkIcon, Calendar, AlertTriangle } from "lucide-react";
import type { ServerNews, InsertServerNews, UpdateServerNews } from "@shared/schema";

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "updates", label: "Actualizaciones" },
  { value: "events", label: "Eventos" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "patches", label: "Parches" },
  { value: "announcements", label: "Anuncios" }
];

const priorityOptions = [
  { value: "low", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" }
];

export default function ServerNewsManager() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<ServerNews | null>(null);
  const [imageType, setImageType] = useState<'predefined' | 'url' | 'upload'>('predefined');
  const [editImageType, setEditImageType] = useState<'predefined' | 'url' | 'upload'>('predefined');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editUploadingImage, setEditUploadingImage] = useState(false);

  // Fetch news
  const { data: newsData, isLoading } = useQuery<{ success: boolean; news: ServerNews[] }>({
    queryKey: ['/api/server-news'],
  });

  // Create form
  const createForm = useForm<InsertServerNews>({
    resolver: zodResolver(insertServerNewsSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      image: "",
      category: "general",
      priority: "normal",
      displayOrder: 0,
      isActive: true,
    },
  });

  // Edit form  
  const editForm = useForm<UpdateServerNews>({
    resolver: zodResolver(updateServerNewsSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      image: "",
      category: "general",
      priority: "normal",
      displayOrder: 0,
      isActive: true,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertServerNews) => {
      const res = await apiRequest('POST', '/api/server-news', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-news'] });
      toast({
        title: "¡Éxito!",
        description: "Noticia creada exitosamente.",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
      setImageType('predefined');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la noticia",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServerNews }) => {
      const res = await apiRequest('PATCH', `/api/server-news/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-news'] });
      toast({
        title: "¡Éxito!",
        description: "Noticia actualizada exitosamente.",
      });
      setEditingNews(null);
      editForm.reset();
      setEditImageType('predefined');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la noticia",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/server-news/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-news'] });
      toast({
        title: "¡Éxito!",
        description: "Noticia eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la noticia",
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = async (file: File, isEdit = false) => {
    const formData = new FormData();
    formData.append('image', file);

    if (isEdit) {
      setEditUploadingImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      
      if (isEdit) {
        editForm.setValue('image', result.imagePath);
      } else {
        createForm.setValue('image', result.imagePath);
      }

      toast({
        title: "¡Éxito!",
        description: "Imagen subida exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      if (isEdit) {
        setEditUploadingImage(false);
      } else {
        setUploadingImage(false);
      }
    }
  };

  // Handle create submit
  const onCreateSubmit = (data: InsertServerNews) => {
    createMutation.mutate(data);
  };

  // Handle edit submit
  const onEditSubmit = (data: UpdateServerNews) => {
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data });
    }
  };

  // Handle edit news
  const handleEditNews = (news: ServerNews) => {
    setEditingNews(news);
    editForm.reset({
      title: news.title,
      content: news.content,
      summary: news.summary,
      image: news.image,
      category: news.category,
      priority: news.priority,
      displayOrder: news.displayOrder,
      isActive: news.isActive,
    });

    // Determine image type
    if (news.image.startsWith('http://') || news.image.startsWith('https://')) {
      setEditImageType('url');
    } else if (news.image.startsWith('/uploads/')) {
      setEditImageType('upload');
    } else {
      setEditImageType('predefined');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-3 h-3" />;
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Noticias del Servidor</CardTitle>
          <CardDescription>Cargando noticias...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const news = newsData?.news || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Gestión de Noticias del Servidor
        </CardTitle>
        <CardDescription>
          Administra las noticias que aparecerán en la página principal del servidor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {news.length} noticia{news.length !== 1 ? 's' : ''} total{news.length !== 1 ? 'es' : ''}
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-news">
                <Plus className="w-4 h-4 mr-2" />
                Crear Noticia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Noticia</DialogTitle>
                <DialogDescription>
                  Crea una nueva noticia para el servidor. Asegúrate de llenar todos los campos.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Título de la noticia..." 
                            {...field} 
                            data-testid="input-news-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumen</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Resumen breve de la noticia..."
                            className="min-h-[60px]"
                            {...field} 
                            data-testid="input-news-summary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Contenido completo de la noticia..."
                            className="min-h-[120px]"
                            {...field} 
                            data-testid="input-news-content"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-news-category">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-news-priority">
                                <SelectValue placeholder="Seleccionar prioridad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden de visualización</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-news-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image selection */}
                  <div className="space-y-4">
                    <FormLabel>Imagen</FormLabel>
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={imageType === 'predefined' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageType('predefined')}
                        data-testid="button-image-predefined"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Predefinida
                      </Button>
                      <Button
                        type="button"
                        variant={imageType === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageType('url')}
                        data-testid="button-image-url"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        URL Externa
                      </Button>
                      <Button
                        type="button"
                        variant={imageType === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageType('upload')}
                        data-testid="button-image-upload"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Archivo
                      </Button>
                    </div>

                    {imageType === 'predefined' && (
                      <FormField
                        control={createForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-predefined-image">
                                  <SelectValue placeholder="Seleccionar imagen predefinida" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fatedRaids">Fated Raids</SelectItem>
                                <SelectItem value="customBoss">Custom Boss</SelectItem>
                                <SelectItem value="classRebalance">Class Rebalance</SelectItem>
                                <SelectItem value="hardcoreChallenge">Hardcore Challenge</SelectItem>
                                <SelectItem value="dungeonCompanions">Dungeon Companions</SelectItem>
                                <SelectItem value="reworkedAffixes">Reworked Affixes</SelectItem>
                                <SelectItem value="alliedRaces">Allied Races</SelectItem>
                                <SelectItem value="timewalking">Timewalking</SelectItem>
                                <SelectItem value="donatorShop">Donator Shop</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {imageType === 'url' && (
                      <FormField
                        control={createForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="https://ejemplo.com/imagen.jpg"
                                {...field}
                                data-testid="input-image-url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {imageType === 'upload' && (
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          disabled={uploadingImage}
                          data-testid="input-file-upload"
                        />
                        {uploadingImage && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Subiendo imagen...
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="bg-gaming-gold hover:bg-gaming-gold/90"
                      data-testid="button-submit-news"
                    >
                      {createMutation.isPending ? "Creando..." : "Crear Noticia"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {news.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-6">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No hay noticias</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comienza creando tu primera noticia del servidor.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            news.map((newsItem) => (
              <Card key={newsItem.id} data-testid={`card-news-${newsItem.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold truncate">
                          {newsItem.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(newsItem.priority)}
                          <Badge 
                            variant="secondary" 
                            className={`text-white ${getPriorityColor(newsItem.priority)}`}
                          >
                            {priorityOptions.find(p => p.value === newsItem.priority)?.label}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {categoryOptions.find(c => c.value === newsItem.category)?.label}
                        </Badge>
                        {!newsItem.isActive && (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {newsItem.summary}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        Orden: {newsItem.displayOrder} • 
                        Publicada: {new Date(newsItem.publishedAt!).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNews(newsItem)}
                        data-testid={`button-edit-news-${newsItem.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-delete-news-${newsItem.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(newsItem.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Noticia</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la noticia. Los cambios se guardarán automáticamente.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Título de la noticia..." 
                          {...field} 
                          data-testid="input-edit-news-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumen</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Resumen breve de la noticia..."
                          className="min-h-[60px]"
                          {...field} 
                          data-testid="input-edit-news-summary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Contenido completo de la noticia..."
                          className="min-h-[120px]"
                          {...field} 
                          data-testid="input-edit-news-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-news-category">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-news-priority">
                              <SelectValue placeholder="Seleccionar prioridad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden de visualización</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-edit-news-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Activa</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Mostrar en la página principal
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                            data-testid="checkbox-edit-news-active"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image selection for edit */}
                <div className="space-y-4">
                  <FormLabel>Imagen</FormLabel>
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      variant={editImageType === 'predefined' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditImageType('predefined')}
                      data-testid="button-edit-image-predefined"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Predefinida
                    </Button>
                    <Button
                      type="button"
                      variant={editImageType === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditImageType('url')}
                      data-testid="button-edit-image-url"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL Externa
                    </Button>
                    <Button
                      type="button"
                      variant={editImageType === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditImageType('upload')}
                      data-testid="button-edit-image-upload"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </div>

                  {editImageType === 'predefined' && (
                    <FormField
                      control={editForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-edit-predefined-image">
                                <SelectValue placeholder="Seleccionar imagen predefinida" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fatedRaids">Fated Raids</SelectItem>
                              <SelectItem value="customBoss">Custom Boss</SelectItem>
                              <SelectItem value="classRebalance">Class Rebalance</SelectItem>
                              <SelectItem value="hardcoreChallenge">Hardcore Challenge</SelectItem>
                              <SelectItem value="dungeonCompanions">Dungeon Companions</SelectItem>
                              <SelectItem value="reworkedAffixes">Reworked Affixes</SelectItem>
                              <SelectItem value="alliedRaces">Allied Races</SelectItem>
                              <SelectItem value="timewalking">Timewalking</SelectItem>
                              <SelectItem value="donatorShop">Donator Shop</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {editImageType === 'url' && (
                    <FormField
                      control={editForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="https://ejemplo.com/imagen.jpg"
                              {...field}
                              data-testid="input-edit-image-url"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {editImageType === 'upload' && (
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, true);
                          }
                        }}
                        disabled={editUploadingImage}
                        data-testid="input-edit-file-upload"
                      />
                      {editUploadingImage && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Subiendo imagen...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditingNews(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="bg-gaming-gold hover:bg-gaming-gold/90"
                    data-testid="button-update-news"
                  >
                    {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}