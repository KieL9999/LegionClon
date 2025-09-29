import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Server, 
  Copy, 
  Check, 
  Download, 
  Shield, 
  Users, 
  Globe,
  Gamepad2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import serverLogo from "@assets/generated_images/Legion_gaming_server_logo_63d36140.png";

interface RealmistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RealmistModal({ open, onOpenChange }: RealmistModalProps) {
  const [copiedRealmlist, setCopiedRealmlist] = useState(false);
  const [copiedWebsite, setCopiedWebsite] = useState(false);
  const { toast } = useToast();

  // TODO: Replace with real server information
  const serverInfo = {
    name: "AetherWoW",
    realmlist: "set realmlist logon.aetherwow.com",
    website: "https://aetherwow.com",
    version: "7.3.5 (26972)",
    playersOnline: 247,
    maxPlayers: 3000,
    uptime: "99.9%",
    rates: {
      xp: 7,
      gold: 3,
      drop: 2
    }
  };

  const copyToClipboard = async (text: string, type: 'realmlist' | 'website') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'realmlist') {
        setCopiedRealmlist(true);
        setTimeout(() => setCopiedRealmlist(false), 2000);
      } else {
        setCopiedWebsite(true);
        setTimeout(() => setCopiedWebsite(false), 2000);
      }
      
      toast({
        title: "¡Copiado!",
        description: `${type === 'realmlist' ? 'Realmlist' : 'Sitio web'} copiado al portapapeles`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-background to-card border-gaming-gold/20" data-testid="modal-realmist">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={serverLogo} 
              alt="AetherWoW" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <DialogTitle className="text-2xl font-gaming font-bold text-gaming-gold">
                {serverInfo.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                ¡Todo listo para comenzar tu aventura!
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-status-online animate-pulse"></div>
            <Badge variant="secondary" className="bg-status-online text-white">
              Servidor Online
            </Badge>
          </div>
        </DialogHeader>

        {/* Server Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-card/60 rounded-lg border border-card-border">
            <Users className="w-5 h-5 mx-auto mb-1 text-gaming-emerald" />
            <div className="font-bold text-gaming-gold" data-testid="text-modal-online-count">
              {serverInfo.playersOnline}
            </div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <div className="text-center p-3 bg-card/60 rounded-lg border border-card-border">
            <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-gaming-alliance" />
            <div className="font-bold text-gaming-gold">x{serverInfo.rates.xp}</div>
            <div className="text-xs text-muted-foreground">EXP Rate</div>
          </div>
          <div className="text-center p-3 bg-card/60 rounded-lg border border-card-border">
            <Shield className="w-5 h-5 mx-auto mb-1 text-gaming-horde" />
            <div className="font-bold text-gaming-gold">{serverInfo.uptime}</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center p-3 bg-card/60 rounded-lg border border-card-border">
            <Server className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="font-bold text-gaming-gold">{serverInfo.version}</div>
            <div className="text-xs text-muted-foreground">Versión</div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Realmlist Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-gaming-gold" />
              Configuración del Realmlist
            </h3>
            <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between gap-3">
                <code className="text-gaming-gold flex-1" data-testid="text-realmlist-command">
                  {serverInfo.realmlist}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(serverInfo.realmlist, 'realmlist')}
                  className="shrink-0"
                  data-testid="button-copy-realmlist"
                >
                  {copiedRealmlist ? (
                    <Check className="w-4 h-4 text-gaming-emerald" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card/40 border border-gaming-gold/20 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2 text-sm">
              📋 Instrucciones:
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Abre la consola del juego (tecla <kbd className="bg-muted px-1 rounded">Enter</kbd>)</li>
              <li>2. Pega el comando del realmlist</li>
              <li>3. Reinicia el cliente WoW</li>
              <li>4. ¡Inicia sesión y comienza tu aventura!</li>
            </ol>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => copyToClipboard(serverInfo.website, 'website')}
            data-testid="button-copy-website"
          >
            <Globe className="w-4 h-4 mr-2" />
            {copiedWebsite ? 'Sitio copiado' : 'Copiar sitio web'}
            {copiedWebsite && <Check className="w-4 h-4 ml-2 text-gaming-emerald" />}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              // TODO: Replace with real download functionality
              console.log('Download client clicked');
              toast({
                title: "Descarga del cliente",
                description: "La descarga comenzará pronto...",
              });
            }}
            data-testid="button-download-client-modal"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Cliente
          </Button>
          
          <Button 
            className="flex-1 bg-gradient-to-r from-gaming-gold to-yellow-500 hover:from-yellow-500 hover:to-gaming-gold text-black font-bold"
            onClick={() => {
              // TODO: Replace with real registration functionality  
              console.log('Create account clicked');
              onOpenChange(false);
            }}
            data-testid="button-create-account-modal"
          >
            <Shield className="w-4 h-4 mr-2" />
            Crear Cuenta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}