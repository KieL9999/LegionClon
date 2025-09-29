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
import { insertDownloadSchema, updateDownloadSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Download as DownloadIcon, Link as LinkIcon, HardDrive, Calendar, Upload, FileText, X } from "lucide-react";
import type { Download, InsertDownload, UpdateDownload } from "@shared/schema";

const typeOptions = [
  { value: "client", label: "Cliente Completo" },
  { value: "patch", label: "Parche" },
  { value: "addon", label: "Addon" },
  { value: "tool", label: "Herramienta" }
];

const platformOptions = [
  { value: "windows", label: "Windows" },
  { value: "mac", label: "macOS" },
  { value: "linux", label: "Linux" }
];

export default function DownloadsManager() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null); // Download ID currently uploading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch downloads
  const { data: downloadsData, isLoading } = useQuery<{ success: boolean; downloads: Download[] }>({
    queryKey: ['/api/downloads'],
  });

  // Create form
  const createForm = useForm<InsertDownload>({
    resolver: zodResolver(insertDownloadSchema),
    defaultValues: {
      title: "",
      description: "",
      version: "",
      downloadUrl: "",
      fileSize: "",
      type: "client",
      platform: "windows",
      isActive: true,
      displayOrder: 0,
    },
  });

  // Edit form
  const editForm = useForm<UpdateDownload>({
    resolver: zodResolver(updateDownloadSchema),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertDownload) =>
      apiRequest("POST", "/api/downloads", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Éxito",
        description: "Descarga creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la descarga",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDownload }) =>
      apiRequest("PATCH", `/api/downloads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
      setEditingDownload(null);
      editForm.reset();
      toast({
        title: "Éxito",
        description: "Descarga actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la descarga",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/downloads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
      toast({
        title: "Éxito",
        description: "Descarga eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la descarga",
        variant: "destructive",
      });
    },
  });

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ downloadId, file, type }: { downloadId: string; file: File; type: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await fetch(`/api/downloads/${downloadId}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al subir archivo');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
      setUploadingFile(null);
      setSelectedFile(null);
      toast({
        title: "Éxito",
        description: "Archivo subido exitosamente",
      });
    },
    onError: (error: any) => {
      setUploadingFile(null);
      toast({
        title: "Error",
        description: error.message || "Error al subir el archivo",
        variant: "destructive",
      });
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: (downloadId: string) =>
      apiRequest("DELETE", `/api/downloads/${downloadId}/file`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
      toast({
        title: "Éxito",
        description: "Archivo eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el archivo",
        variant: "destructive",
      });
    },
  });

  const handleCreateSubmit = (data: InsertDownload) => {
    createMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: UpdateDownload) => {
    if (editingDownload) {
      updateMutation.mutate({ id: editingDownload.id, data });
    }
  };

  const handleEdit = (download: Download) => {
    setEditingDownload(download);
    editForm.reset({
      title: download.title,
      description: download.description,
      version: download.version,
      downloadUrl: download.downloadUrl || "",
      fileSize: download.fileSize,
      type: download.type,
      platform: download.platform,
      isActive: download.isActive,
      displayOrder: download.displayOrder,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleFileUpload = (downloadId: string, file: File, type: string) => {
    setUploadingFile(downloadId);
    uploadFileMutation.mutate({ downloadId, file, type });
  };

  const handleFileDelete = (downloadId: string) => {
    deleteFileMutation.mutate(downloadId);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const downloads = downloadsData?.downloads || [];

  if (isLoading) {
    return <div className="text-center py-4">Cargando descargas...</div>;
  }

  return (
    <Card className="bg-muted border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Gestión de Descargas</span>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-gaming-gold hover:bg-gaming-gold/90"
                data-testid="button-create-download"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Descarga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Descarga</DialogTitle>
                <DialogDescription>
                  Agrega una nueva descarga para el cliente, parches o herramientas
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-download-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versión</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="v7.3.5.26972" data-testid="input-download-version" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Descripción de la descarga"
                            className="min-h-[100px]"
                            data-testid="textarea-download-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={createForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-download-type">
                                <SelectValue placeholder="Seleccionar tipo" />
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
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plataforma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-download-platform">
                                <SelectValue placeholder="Seleccionar plataforma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platformOptions.map((option) => (
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
                      name="fileSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamaño del Archivo</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="4.2 GB" data-testid="input-download-filesize" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="downloadUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Descarga (Opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="https://example.com/download/file.exe (Opcional - puedes subir archivo local después)"
                            data-testid="input-download-url"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Puedes dejar esto vacío y subir un archivo local después de crear la descarga
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden de Visualización</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-download-order"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0 pt-8">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value} 
                              onChange={(e) => field.onChange(e.target.checked)}
                              data-testid="checkbox-download-active"
                            />
                          </FormControl>
                          <FormLabel>Activa</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="bg-gaming-gold hover:bg-gaming-gold/90"
                    >
                      {createMutation.isPending ? "Creando..." : "Crear"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Gestiona las descargas disponibles para los usuarios: cliente completo, parches y herramientas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {downloads.length === 0 ? (
          <div className="text-center py-8">
            <DownloadIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay descargas configuradas</h3>
            <p className="text-muted-foreground mb-4">
              Agrega descargas para que los usuarios puedan descargar el cliente y parches
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {downloads.map((download) => (
              <Card key={download.id} className="bg-background border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{download.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {typeOptions.find(t => t.value === download.type)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {platformOptions.find(p => p.value === download.platform)?.label}
                        </Badge>
                        {!download.isActive && (
                          <Badge variant="destructive" className="text-xs">
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{download.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <LinkIcon className="w-4 h-4" />
                          {download.version}
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-4 h-4" />
                          {download.fileSize}
                        </div>
                        <div className="flex items-center gap-1">
                          <DownloadIcon className="w-4 h-4" />
                          {download.downloadCount} descargas
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(download.releaseDate!).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          {download.localFilePath ? (
                            <Badge variant="default" className="text-xs bg-green-600">
                              <FileText className="w-3 h-3 mr-1" />
                              Archivo Local
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <LinkIcon className="w-3 h-3 mr-1" />
                              URL Externa
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {download.localFilePath ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileDelete(download.id)}
                          disabled={deleteFileMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-delete-file-${download.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="file"
                            id={`file-input-${download.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(download.id, file, download.type);
                              }
                            }}
                            accept=".exe,.zip,.rar,.7z,.msi,.dmg,.pkg,.deb,.rpm,.tar.gz"
                            data-testid={`input-file-${download.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-input-${download.id}`)?.click()}
                            disabled={uploadingFile === download.id}
                            data-testid={`button-upload-file-${download.id}`}
                          >
                            {uploadingFile === download.id ? (
                              "Subiendo..."
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(download)}
                        data-testid={`button-edit-download-${download.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-download-${download.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar descarga?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. La descarga será eliminada permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(download.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingDownload} onOpenChange={() => setEditingDownload(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Descarga</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la descarga
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-download-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Versión</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="v7.3.5.26972" data-testid="input-edit-download-version" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Descripción de la descarga"
                        className="min-h-[100px]"
                        data-testid="textarea-edit-download-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-download-type">
                            <SelectValue placeholder="Seleccionar tipo" />
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
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plataforma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-download-platform">
                            <SelectValue placeholder="Seleccionar plataforma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platformOptions.map((option) => (
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
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño del Archivo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="4.2 GB" data-testid="input-edit-download-filesize" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="downloadUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Descarga (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://example.com/download/file.exe (Opcional - usa archivo local si está disponible)"
                        data-testid="input-edit-download-url"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      La URL externa se usará solo si no hay archivo local subido
                    </p>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orden de Visualización</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-edit-download-order"
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
                    <FormItem className="flex items-center space-x-2 space-y-0 pt-8">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          checked={field.value} 
                          onChange={(e) => field.onChange(e.target.checked)}
                          data-testid="checkbox-edit-download-active"
                        />
                      </FormControl>
                      <FormLabel>Activa</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingDownload(null)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="bg-gaming-gold hover:bg-gaming-gold/90"
                >
                  {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}