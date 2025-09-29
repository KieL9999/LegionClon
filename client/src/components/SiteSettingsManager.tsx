import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateSiteSettingSchema, insertSiteSettingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Globe, Image as ImageIcon, Save } from "lucide-react";
import type { SiteSetting, UpdateSiteSetting, InsertSiteSetting } from "@shared/schema";
import { z } from "zod";

const updateSettingFormSchema = z.object({
  value: z.string().min(1, "El valor es requerido"),
  description: z.string().optional(),
});

type UpdateSettingFormData = z.infer<typeof updateSettingFormSchema>;

export default function SiteSettingsManager() {
  const { toast } = useToast();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Fetch site settings
  const { data: settingsData, isLoading } = useQuery<{ success: boolean; settings: SiteSetting[] }>({
    queryKey: ['/api/site-settings'],
  });

  // Update form
  const updateForm = useForm<UpdateSettingFormData>({
    resolver: zodResolver(updateSettingFormSchema),
    defaultValues: {
      value: "",
      description: "",
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSiteSetting }) =>
      apiRequest("PATCH", `/api/site-settings/${key}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      setEditingKey(null);
      updateForm.reset();
      toast({
        title: "Éxito",
        description: "Configuración actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la configuración",
        variant: "destructive",
      });
    },
  });

  // Initialize default settings
  const initializeDefaults = async () => {
    setIsInitializing(true);
    const defaultSettings: InsertSiteSetting[] = [
      {
        key: 'site_title',
        value: 'AetherWoW - Servidor Privado WoW Legion | La Aventura Legendaria Te Espera',
        description: 'Título del sitio web que aparece en el navegador',
        type: 'text'
      },
      {
        key: 'site_description',
        value: 'Únete a la aventura épica en AetherWoW, el mejor servidor privado de World of Warcraft Legion con raids personalizados, jefes únicos y desafíos hardcore. ¡Empieza tu legendaria aventura ahora!',
        description: 'Descripción del sitio para SEO',
        type: 'text'
      },
      {
        key: 'site_favicon',
        value: '/favicon.ico',
        description: 'URL o ruta del ícono del sitio (favicon)',
        type: 'image'
      },
      {
        key: 'og_title',
        value: 'AetherWoW - Servidor Privado WoW Legion',
        description: 'Título para Open Graph (redes sociales)',
        type: 'text'
      },
      {
        key: 'og_description',
        value: 'La mejor experiencia de World of Warcraft Legion con contenido personalizado y comunidad activa',
        description: 'Descripción para Open Graph',
        type: 'text'
      }
    ];

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const setting of defaultSettings) {
        try {
          await apiRequest("POST", `/api/site-settings`, setting);
          successCount++;
        } catch (error: any) {
          if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
            // Setting already exists, ignore
            continue;
          }
          errorCount++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      if (successCount > 0) {
        toast({
          title: "Éxito",
          description: `Se inicializaron ${successCount} configuraciones por defecto`,
        });
      } else {
        toast({
          title: "Información",
          description: "Las configuraciones ya estaban inicializadas",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al inicializar configuraciones por defecto",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleEdit = (setting: SiteSetting) => {
    setEditingKey(setting.key);
    updateForm.setValue("value", setting.value);
    updateForm.setValue("description", setting.description || "");
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    updateForm.reset();
  };

  const handleUpdate = (data: UpdateSettingFormData) => {
    if (!editingKey) return;
    
    updateMutation.mutate({
      key: editingKey,
      data: {
        value: data.value,
        description: data.description,
      }
    });
  };

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'site_title':
      case 'og_title':
        return <Globe className="w-4 h-4" />;
      case 'site_favicon':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getSettingLabel = (key: string) => {
    switch (key) {
      case 'site_title':
        return 'Título del Sitio';
      case 'site_description':
        return 'Descripción del Sitio';
      case 'site_favicon':
        return 'Ícono del Sitio (Favicon)';
      case 'og_title':
        return 'Título Open Graph';
      case 'og_description':
        return 'Descripción Open Graph';
      default:
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const settings = settingsData?.settings || [];

  if (isLoading) {
    return <div className="text-center py-4">Cargando configuraciones...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-muted/50 border border-border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Configuraciones del Sitio</h2>
            <p className="text-sm text-muted-foreground">
              Configura el título, descripción e ícono del sitio web
            </p>
          </div>
          {settings.length === 0 && (
            <Button
              onClick={initializeDefaults}
              disabled={isInitializing}
              className="bg-gaming-gold hover:bg-gaming-gold/90 text-black font-semibold"
              data-testid="button-initialize-settings"
            >
              {isInitializing ? "Inicializando..." : "Inicializar"}
            </Button>
          )}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Settings className="h-4 w-4" />
        <span>{settings.length} {settings.length === 1 ? 'configuración' : 'configuraciones'}</span>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {settings.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay configuraciones</h3>
            <p className="text-muted-foreground mb-4">
              Inicializa las configuraciones del sitio para comenzar
            </p>
          </div>
        ) : (
          settings.map((setting) => (
            <div key={setting.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSettingIcon(setting.key)}
                  <h3 className="font-semibold text-foreground" data-testid={`text-setting-label-${setting.key}`}>
                    {getSettingLabel(setting.key)}
                  </h3>
                </div>
                {editingKey !== setting.key && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(setting)}
                    data-testid={`button-edit-setting-${setting.key}`}
                  >
                    Editar
                  </Button>
                )}
              </div>

              {editingKey === setting.key ? (
                <Form {...updateForm}>
                  <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
                    <FormField
                      control={updateForm.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            {setting.key === 'site_description' || setting.key === 'og_description' ? (
                              <Textarea
                                {...field}
                                placeholder="Ingresa la descripción..."
                                rows={3}
                                data-testid={`input-setting-value-${setting.key}`}
                              />
                            ) : (
                              <Input
                                {...field}
                                placeholder="Ingresa el valor..."
                                data-testid={`input-setting-value-${setting.key}`}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción (Opcional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Descripción de la configuración..."
                              data-testid={`input-setting-description-${setting.key}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={updateMutation.isPending}
                        className="bg-gaming-gold hover:bg-gaming-gold/90"
                        data-testid={`button-save-setting-${setting.key}`}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {updateMutation.isPending ? "Guardando..." : "Guardar"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        data-testid={`button-cancel-setting-${setting.key}`}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-2">
                  <div className="bg-background/50 border border-card-border rounded p-3">
                    <p className="text-sm text-muted-foreground mb-1">Valor actual:</p>
                    <p className="font-mono text-sm break-all" data-testid={`text-setting-current-value-${setting.key}`}>
                      {setting.value}
                    </p>
                  </div>
                  {setting.description && (
                    <p className="text-xs text-muted-foreground" data-testid={`text-setting-description-${setting.key}`}>
                      {setting.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}