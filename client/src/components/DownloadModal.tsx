import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Lock, Calendar, HardDrive, Users, FileText } from "lucide-react";

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DownloadModal({ open, onOpenChange }: DownloadModalProps) {
  const handleDownload = (type: string, url: string) => {
    console.log(`Downloading ${type}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-gaming-gold">
            Descargas de Legion Plus
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Elige entre el cliente completo o descargar solo los parches más recientes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cliente Completo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gaming-gold" />
              <h3 className="text-xl font-bold text-gaming-gold">Cliente Completo</h3>
            </div>
            
            <div className="bg-background/50 border border-gaming-gold/20 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-gaming-emerald text-black">
                      Cliente
                    </Badge>
                    <span className="text-sm font-mono text-gaming-gold" data-testid="text-client-version">
                      v7.3.5.26972
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2" data-testid="text-client-title">
                    World of Warcraft Legion - Cliente Completo
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Cliente completo de World of Warcraft Legion 7.3.5 optimizado para Legion Plus
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  27 de septiembre de 2025
                </span>
              </div>

              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span>Tamaño:</span>
                  <span className="font-semibold" data-testid="text-client-size">28.5 GB</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Descargas:</span>
                  <span className="font-semibold text-gaming-gold" data-testid="text-client-downloads">1247</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Actualizado:</span>
                  <span className="font-semibold" data-testid="text-client-updated">27 de septiembre de 2025</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-gaming-gold to-yellow-500 hover:from-yellow-500 hover:to-gaming-gold text-black font-bold"
                onClick={() => handleDownload('cliente completo', 'https://legion-gaming.com/downloads/Legion-Client-Full.exe')}
                data-testid="button-download-full-client"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Cliente
              </Button>
            </div>
          </div>

          <Separator />

          {/* Parches y Actualizaciones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gaming-alliance" />
              <h3 className="text-xl font-bold text-gaming-alliance">Parches y Actualizaciones</h3>
            </div>

            <div className="space-y-3">
              {/* Parche de Contenido */}
              <div className="bg-background/50 border border-card-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="border-gaming-alliance text-gaming-alliance">
                        Parche
                      </Badge>
                      <span className="text-sm font-mono text-gaming-alliance" data-testid="text-patch-version-1">
                        v1.2.3
                      </span>
                    </div>
                    <h4 className="font-semibold" data-testid="text-patch-title-1">Parche de Contenido 1.2.3</h4>
                    <p className="text-sm text-muted-foreground">
                      Últimas correcciones de bugs y nuevo contenido exclusivo del servidor
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    27 de septiembre de 2025
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-muted-foreground" />
                      <span>Tamaño:</span>
                      <span className="font-semibold" data-testid="text-patch-size-1">156 MB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>Descargas:</span>
                      <span className="font-semibold text-gaming-alliance" data-testid="text-patch-downloads-1">892</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload('parche contenido', 'https://legion-gaming.com/downloads/patches/content-1.2.3.exe')}
                    data-testid="button-download-patch-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>

              {/* Parche de Balance */}
              <div className="bg-background/50 border border-card-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="border-gaming-alliance text-gaming-alliance">
                        Parche
                      </Badge>
                      <span className="text-sm font-mono text-gaming-alliance" data-testid="text-patch-version-2">
                        v1.2.2
                      </span>
                    </div>
                    <h4 className="font-semibold" data-testid="text-patch-title-2">Parche de Balance 1.2.2</h4>
                    <p className="text-sm text-muted-foreground">
                      Mejoras de balance de clases y optimizaciones de rendimiento
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    27 de septiembre de 2025
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-muted-foreground" />
                      <span>Tamaño:</span>
                      <span className="font-semibold" data-testid="text-patch-size-2">89 MB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>Descargas:</span>
                      <span className="font-semibold text-gaming-alliance" data-testid="text-patch-downloads-2">1534</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload('parche balance', 'https://legion-gaming.com/downloads/patches/balance-1.2.2.exe')}
                    data-testid="button-download-patch-2"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>

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