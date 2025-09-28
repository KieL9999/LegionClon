import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Shield, Users, LogIn, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RealmistModal from "./RealmistModal";
import RegistrationModal from "./RegistrationModal";
import DownloadModal from "./DownloadModal";
import LoginModal from "./LoginModal";
import serverLogo from "@assets/generated_images/Legion_gaming_server_logo_63d36140.png";

export default function Header() {
  const [realmistOpen, setRealmistOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  
  const handleLoginSuccess = () => {
    // The user data is now available through context
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const handleNoticiasClick = () => {
    if (location === '/') {
      // Si estamos en la página principal, hacer scroll suave a la sección
      const noticiasSection = document.getElementById('noticias');
      if (noticiasSection) {
        noticiasSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegar a la página principal con hash
      window.location.href = '/#noticias';
    }
  };
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
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-inicio">
                Inicio
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-foreground hover-elevate" 
              data-testid="link-noticias"
              onClick={handleNoticiasClick}
            >
              Noticias
            </Button>
            <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-rankings">
              Rankings
            </Button>
            <Link href="/foro">
              <Button variant="ghost" className="text-foreground hover-elevate" data-testid="link-foro">
                Foro
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-foreground hover-elevate" 
              data-testid="link-descargar"
              onClick={() => setDownloadOpen(true)}
            >
              Descargar
            </Button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hidden sm:flex gap-2" 
                      data-testid="button-user-menu"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-gaming-gold font-medium">
                        {user?.username}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      Conectado como {user?.username}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href="/panel">
                      <DropdownMenuItem data-testid="button-player-panel">
                        <User className="w-4 h-4 mr-2" />
                        Panel del Jugador
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  size="sm" 
                  onClick={() => setRealmistOpen(true)}
                  data-testid="button-play"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  ¡Jugar!
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex" 
                  onClick={() => setLoginOpen(true)}
                  data-testid="button-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
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
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
      <RegistrationModal open={registrationOpen} onOpenChange={setRegistrationOpen} />
      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={handleLoginSuccess} />
    </header>
  );
}