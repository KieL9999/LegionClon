import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Shield, Users } from "lucide-react";
import RealmistModal from "./RealmistModal";
import RegistrationModal from "./RegistrationModal";
import serverLogo from "@assets/generated_images/Legion_gaming_server_logo_63d36140.png";

export default function Header() {
  const [realmistOpen, setRealmistOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src={serverLogo} 
              alt="Legion Plus" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-gaming font-bold text-gaming-gold">
                Legion Plus
              </h1>
              <p className="text-sm text-muted-foreground">x7 Server</p>
            </div>
          </div>

          {/* Server Status */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-online animate-pulse"></div>
              <span className="text-sm font-medium text-status-online">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-bold text-gaming-gold" data-testid="text-player-count">
                247
              </span>
              <span className="text-sm text-muted-foreground">jugadores</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-inicio">
              Inicio
            </Button>
            <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-noticias">
              Noticias
            </Button>
            <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-rankings">
              Rankings
            </Button>
            <Button 
              variant="ghost" 
              className="text-foreground hover-elevate" 
              data-testid="link-descargar"
              onClick={() => window.open('https://legion-gaming.com/downloads/Legion-Client.exe', '_blank', 'noopener,noreferrer')}
            >
              Descargar
            </Button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex" 
              onClick={() => setRegistrationOpen(true)}
              data-testid="button-registro"
            >
              <Shield className="w-4 h-4 mr-2" />
              Registro
            </Button>
            <Button 
              size="sm" 
              onClick={() => setRealmistOpen(true)}
              data-testid="button-play"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              ¡Jugar!
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
      <RegistrationModal open={registrationOpen} onOpenChange={setRegistrationOpen} />
    </header>
  );
}