import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Download, Lock, Calendar, HardDrive, Users, FileText, AlertCircle } from "lucide-react";
import type { Download as DownloadType } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DownloadModal({ open, onOpenChange }: DownloadModalProps) {
  // Fetch downloads
  const { data: downloadsData, isLoading, error } = useQuery<{ success: boolean; downloads: DownloadType[] }>({
    queryKey: ['/api/downloads'],
    enabled: open, // Only fetch when modal is open
  });

  const handleDownload = (download: DownloadType) => {
    console.log(`Downloading ${download.title}`);
    // Increment download count could be implemented here
    window.open(download.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter downloads by type
  const activeDownloads = downloadsData?.downloads?.filter(d => d.isActive) || [];
  const clientDownloads = activeDownloads.filter(d => d.type === 'client');
  const patchDownloads = activeDownloads.filter(d => d.type === 'patch');
  const addonDownloads = activeDownloads.filter(d => d.type === 'addon');
  const toolDownloads = activeDownloads.filter(d => d.type === 'tool');

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-gaming-emerald text-black';
      case 'patch': return 'border-gaming-alliance text-gaming-alliance';
      case 'addon': return 'border-gaming-gold text-gaming-gold';
      case 'tool': return 'border-purple-400 text-purple-400';
      default: return 'bg-secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Cliente';
      case 'patch': return 'Parche';
      case 'addon': return 'Addon';
      case 'tool': return 'Herramienta';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return 'Fecha no disponible';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-gaming-gold">
            Descargas de AetherWoW
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Elige entre el cliente completo o descargar solo los parches más recientes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-gold mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando descargas...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground">Error al cargar las descargas</p>
            </div>
          )}

          {/* No downloads available */}
          {!isLoading && !error && activeDownloads.length === 0 && (
            <div className="text-center py-8">
              <Download className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No hay descargas disponibles en este momento</p>
            </div>
          )}

          {/* Cliente Completo */}
          {clientDownloads.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gaming-gold" />
                <h3 className="text-xl font-bold text-gaming-gold">Cliente Completo</h3>
              </div>
              
              {clientDownloads
                .sort((a, b) => b.displayOrder - a.displayOrder)
                .map((download) => (
                <div key={download.id} className="bg-background/50 border border-gaming-gold/20 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={getBadgeColor(download.type)}>
                          {getTypeLabel(download.type)}
                        </Badge>
                        <span className="text-sm font-mono text-gaming-gold" data-testid={`text-client-version-${download.id}`}>
                          {download.version}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold mb-2" data-testid={`text-client-title-${download.id}`}>
                        {download.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {download.description}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(download.releaseDate?.toString() || '')}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-muted-foreground" />
                      <span>Tamaño:</span>
                      <span className="font-semibold" data-testid={`text-client-size-${download.id}`}>{download.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Descargas:</span>
                      <span className="font-semibold text-gaming-gold" data-testid={`text-client-downloads-${download.id}`}>{download.downloadCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Plataforma:</span>
                      <span className="font-semibold capitalize" data-testid={`text-client-platform-${download.id}`}>{download.platform}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-gaming-gold to-yellow-500 hover:from-yellow-500 hover:to-gaming-gold text-black font-bold"
                    onClick={() => handleDownload(download)}
                    data-testid={`button-download-client-${download.id}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Cliente
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Separator if we have clients and other downloads */}
          {clientDownloads.length > 0 && (patchDownloads.length > 0 || addonDownloads.length > 0 || toolDownloads.length > 0) && <Separator />}

          {/* Parches y Actualizaciones */}
          {patchDownloads.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gaming-alliance" />
                <h3 className="text-xl font-bold text-gaming-alliance">Parches y Actualizaciones</h3>
              </div>

              <div className="space-y-3">
                {patchDownloads
                  .sort((a, b) => b.displayOrder - a.displayOrder)
                  .map((download) => (
                  <div key={download.id} className="bg-background/50 border border-card-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getBadgeColor(download.type)}>
                            {getTypeLabel(download.type)}
                          </Badge>
                          <span className="text-sm font-mono text-gaming-alliance" data-testid={`text-patch-version-${download.id}`}>
                            {download.version}
                          </span>
                        </div>
                        <h4 className="font-semibold" data-testid={`text-patch-title-${download.id}`}>{download.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {download.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(download.releaseDate?.toString() || '')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-muted-foreground" />
                          <span>Tamaño:</span>
                          <span className="font-semibold" data-testid={`text-patch-size-${download.id}`}>{download.fileSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span>Descargas:</span>
                          <span className="font-semibold text-gaming-alliance" data-testid={`text-patch-downloads-${download.id}`}>{download.downloadCount}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(download)}
                        data-testid={`button-download-patch-${download.id}`}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          {addonDownloads.length > 0 && (
            <>
              {(clientDownloads.length > 0 || patchDownloads.length > 0) && <Separator />}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-gaming-gold" />
                  <h3 className="text-xl font-bold text-gaming-gold">Addons</h3>
                </div>

                <div className="space-y-3">
                  {addonDownloads
                    .sort((a, b) => b.displayOrder - a.displayOrder)
                    .map((download) => (
                    <div key={download.id} className="bg-background/50 border border-card-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getBadgeColor(download.type)}>
                              {getTypeLabel(download.type)}
                            </Badge>
                            <span className="text-sm font-mono text-gaming-gold" data-testid={`text-addon-version-${download.id}`}>
                              {download.version}
                            </span>
                          </div>
                          <h4 className="font-semibold" data-testid={`text-addon-title-${download.id}`}>{download.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {download.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(download.releaseDate?.toString() || '')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-muted-foreground" />
                            <span>Tamaño:</span>
                            <span className="font-semibold" data-testid={`text-addon-size-${download.id}`}>{download.fileSize}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>Descargas:</span>
                            <span className="font-semibold text-gaming-gold" data-testid={`text-addon-downloads-${download.id}`}>{download.downloadCount}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(download)}
                          data-testid={`button-download-addon-${download.id}`}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Herramientas */}
          {toolDownloads.length > 0 && (
            <>
              {(clientDownloads.length > 0 || patchDownloads.length > 0 || addonDownloads.length > 0) && <Separator />}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-400">Herramientas</h3>
                </div>

                <div className="space-y-3">
                  {toolDownloads
                    .sort((a, b) => b.displayOrder - a.displayOrder)
                    .map((download) => (
                    <div key={download.id} className="bg-background/50 border border-card-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getBadgeColor(download.type)}>
                              {getTypeLabel(download.type)}
                            </Badge>
                            <span className="text-sm font-mono text-purple-400" data-testid={`text-tool-version-${download.id}`}>
                              {download.version}
                            </span>
                          </div>
                          <h4 className="font-semibold" data-testid={`text-tool-title-${download.id}`}>{download.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {download.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(download.releaseDate?.toString() || '')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-muted-foreground" />
                            <span>Tamaño:</span>
                            <span className="font-semibold" data-testid={`text-tool-size-${download.id}`}>{download.fileSize}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>Descargas:</span>
                            <span className="font-semibold text-purple-400" data-testid={`text-tool-downloads-${download.id}`}>{download.downloadCount}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(download)}
                          data-testid={`button-download-tool-${download.id}`}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Instrucciones de Instalación */}
          <div className="bg-background/30 border border-gaming-gold/10 rounded-lg p-4">
            <h4 className="font-semibold text-gaming-gold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Instrucciones de Instalación
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-semibold text-foreground mb-2">Cliente Completo:</h5>
                <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Descarga el cliente completo</li>
                  <li>Extrae el archivo ZIP en tu ubicación preferida</li>
                  <li>Ejecuta el archivo WoW.exe</li>
                  <li>Configura el realmlist según las instrucciones del servidor</li>
                </ol>
              </div>
              
              <div>
                <h5 className="font-semibold text-foreground mb-2">Parches:</h5>
                <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Descarga el parche más reciente</li>
                  <li>Cierra el cliente de WoW si está desactualizado</li>
                  <li>Extrae el parche en la carpeta del juego</li>
                  <li>Inicia el juego normalmente</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}