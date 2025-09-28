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
import { insertWebFeatureSchema, updateWebFeatureSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, Link as LinkIcon } from "lucide-react";
import type { WebFeature, InsertWebFeature, UpdateWebFeature } from "@shared/schema";

const typeOptions = [
  { value: "Action", label: "Action" },
  { value: "Event", label: "Event" },
  { value: "Feature", label: "Feature" }
];

const categoryOptions = [
  { value: "raids", label: "Raids" },
  { value: "pve", label: "PvE" },
  { value: "pvp", label: "PvP" },
  { value: "social", label: "Social" },
  { value: "shop", label: "Shop" },
  { value: "general", label: "General" }
];

export default function WebFeaturesManager() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WebFeature | null>(null);
  const [imageType, setImageType] = useState<'predefined' | 'url' | 'upload'>('predefined');
  const [editImageType, setEditImageType] = useState<'predefined' | 'url' | 'upload'>('predefined');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editUploadingImage, setEditUploadingImage] = useState(false);

  // Fetch features
  const { data: featuresData, isLoading } = useQuery<{ success: boolean; features: WebFeature[] }>({
    queryKey: ['/api/web-features'],
  });

  // Create feature form
  const createForm = useForm<InsertWebFeature>({
    resolver: zodResolver(insertWebFeatureSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      type: "Feature",
      category: "general",
      displayOrder: 0,
      isActive: true,
    },
  });

  // Edit feature form
  const editForm = useForm<UpdateWebFeature>({
    resolver: zodResolver(updateWebFeatureSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      type: "Feature",
      category: "general",
      displayOrder: 0,
      isActive: true,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertWebFeature) =>
      apiRequest("POST", "/api/web-features", data),
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Característica creada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/web-features'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la característica",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebFeature }) =>
      apiRequest("PATCH", `/api/web-features/${id}`, data),
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Característica actualizada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/web-features'] });
      setEditingFeature(null);
      editForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la característica",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/web-features/${id}`),
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Característica eliminada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/web-features'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la característica",
        variant: "destructive",
      });
    },
  });

  const onCreateSubmit = (data: InsertWebFeature) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UpdateWebFeature) => {
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, data });
    }
  };

  const handleEdit = (feature: WebFeature) => {
    setEditingFeature(feature);
    
    // Detect image type automatically
    let detectedImageType: 'predefined' | 'url' | 'upload' = 'predefined';
    if (feature.image.startsWith('http://') || feature.image.startsWith('https://')) {
      detectedImageType = 'url';
    } else if (feature.image.startsWith('/uploads/')) {
      detectedImageType = 'upload';
    }
    
    setEditImageType(detectedImageType);
    
    editForm.reset({
      title: feature.title,
      description: feature.description,
      image: feature.image,
      type: feature.type,
      category: feature.category,
      displayOrder: feature.displayOrder,
      isActive: feature.isActive,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const features = featuresData?.features || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando características...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Gestión de Características</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-feature" className="bg-gaming-gold hover:bg-gaming-gold/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Característica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Característica</DialogTitle>
              <DialogDescription>
                Añade una nueva característica que se mostrará en la página principal
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
                        <Input data-testid="input-feature-title" placeholder="Ejemplo: Raids Fatales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          data-testid="input-feature-description"
                          placeholder="Describe la característica..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <div className="space-y-3">
                        <Select value={imageType} onValueChange={(value: 'predefined' | 'url' | 'upload') => setImageType(value)}>
                          <SelectTrigger data-testid="select-image-type">
                            <SelectValue placeholder="Selecciona el tipo de imagen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="predefined">
                              <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Imagen predefinida
                              </div>
                            </SelectItem>
                            <SelectItem value="url">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                URL externa
                              </div>
                            </SelectItem>
                            <SelectItem value="upload">
                              <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Subir archivo
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {imageType === 'predefined' && (
                          <FormControl>
                            <Input 
                              data-testid="input-feature-image"
                              placeholder="Nombre de la imagen (ej: fatedRaids)" 
                              {...field} 
                            />
                          </FormControl>
                        )}
                        
                        {imageType === 'url' && (
                          <FormControl>
                            <Input 
                              data-testid="input-feature-image-url"
                              placeholder="https://ejemplo.com/imagen.jpg" 
                              type="url"
                              {...field} 
                            />
                          </FormControl>
                        )}
                        
                        {imageType === 'upload' && (
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              data-testid="input-feature-image-upload"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                setUploadingImage(true);
                                try {
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  
                                  const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  
                                  if (!response.ok) {
                                    throw new Error('Error al subir la imagen');
                                  }
                                  
                                  const data = await response.json();
                                  field.onChange(data.url);
                                  
                                  toast({
                                    title: "¡Imagen subida!",
                                    description: "La imagen se ha subido exitosamente",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "No se pudo subir la imagen",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setUploadingImage(false);
                                }
                              }}
                            />
                            {uploadingImage && (
                              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                            )}
                            {field.value && imageType === 'upload' && (
                              <p className="text-sm text-muted-foreground">Imagen: {field.value}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-feature-type">
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeOptions.map((option) => (
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-feature-category">
                              <SelectValue placeholder="Selecciona una categoría" />
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
                </div>
                <FormField
                  control={createForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orden de Visualización</FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-feature-order"
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-create"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    data-testid="button-submit-create"
                    className="bg-gaming-gold hover:bg-gaming-gold/90"
                  >
                    {createMutation.isPending ? "Creando..." : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {features.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No hay características configuradas
            </CardContent>
          </Card>
        ) : (
          features.map((feature: WebFeature) => (
            <Card key={feature.id} className="bg-muted border-border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground" data-testid={`text-feature-title-${feature.id}`}>
                        {feature.title}
                      </h4>
                      <Badge variant="secondary" data-testid={`badge-feature-type-${feature.id}`}>
                        {feature.type}
                      </Badge>
                      <Badge variant="outline" data-testid={`badge-feature-category-${feature.id}`}>
                        {feature.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-feature-description-${feature.id}`}>
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ImageIcon className="h-3 w-3" />
                      <span>{feature.image}</span>
                      <span>•</span>
                      <span>Orden: {feature.displayOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(feature)}
                      data-testid={`button-edit-feature-${feature.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-feature-${feature.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar característica?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La característica "{feature.title}" será eliminada permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid={`button-cancel-delete-${feature.id}`}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(feature.id)}
                            className="bg-destructive hover:bg-destructive/90"
                            data-testid={`button-confirm-delete-${feature.id}`}
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
      <Dialog open={!!editingFeature} onOpenChange={(open) => !open && setEditingFeature(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Característica</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la característica
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
                      <Input data-testid="input-edit-feature-title" placeholder="Ejemplo: Raids Fatales" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        data-testid="input-edit-feature-description"
                        placeholder="Describe la característica..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <div className="space-y-3">
                      <Select value={editImageType} onValueChange={(value: 'predefined' | 'url' | 'upload') => setEditImageType(value)}>
                        <SelectTrigger data-testid="select-edit-image-type">
                          <SelectValue placeholder="Selecciona el tipo de imagen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="predefined">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Imagen predefinida
                            </div>
                          </SelectItem>
                          <SelectItem value="url">
                            <div className="flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              URL externa
                            </div>
                          </SelectItem>
                          <SelectItem value="upload">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Subir archivo
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {editImageType === 'predefined' && (
                        <FormControl>
                          <Input 
                            data-testid="input-edit-feature-image"
                            placeholder="Nombre de la imagen (ej: fatedRaids)" 
                            {...field} 
                          />
                        </FormControl>
                      )}
                      
                      {editImageType === 'url' && (
                        <FormControl>
                          <Input 
                            data-testid="input-edit-feature-image-url"
                            placeholder="https://ejemplo.com/imagen.jpg" 
                            type="url"
                            {...field} 
                          />
                        </FormControl>
                      )}
                      
                      {editImageType === 'upload' && (
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            disabled={editUploadingImage}
                            data-testid="input-edit-feature-image-upload"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              setEditUploadingImage(true);
                              try {
                                const formData = new FormData();
                                formData.append('image', file);
                                
                                const response = await fetch('/api/upload-image', {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Error al subir la imagen');
                                }
                                
                                const data = await response.json();
                                field.onChange(data.url);
                                
                                toast({
                                  title: "¡Imagen subida!",
                                  description: "La imagen se ha subido exitosamente",
                                });
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "No se pudo subir la imagen",
                                  variant: "destructive",
                                });
                              } finally {
                                setEditUploadingImage(false);
                              }
                            }}
                          />
                          {editUploadingImage && (
                            <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                          )}
                          {field.value && editImageType === 'upload' && (
                            <p className="text-sm text-muted-foreground">Imagen: {field.value}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-feature-type">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeOptions.map((option) => (
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-feature-category">
                            <SelectValue placeholder="Selecciona una categoría" />
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
              </div>
              <FormField
                control={editForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de Visualización</FormLabel>
                    <FormControl>
                      <Input 
                        data-testid="input-edit-feature-order"
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingFeature(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-edit"
                  className="bg-gaming-gold hover:bg-gaming-gold/90"
                >
                  {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}