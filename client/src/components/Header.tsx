import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Shield, Users, LogIn, LogOut, User, DollarSign, ShoppingBag } from "lucide-react";
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

  const handleRankingsClick = () => {
    if (location === '/') {
      // Si estamos en la página principal, hacer scroll suave a la sección
      const rankingsSection = document.getElementById('rankings');
      if (rankingsSection) {
        rankingsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegar a la página principal con hash
      window.location.href = '/#rankings';
    }
  };
  return (
    <header className="relative">
      {/* Modern header with glassmorphism and gradient effects */}
      <div className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-gaming-gold/20 shadow-2xl">
        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gaming-gold to-transparent opacity-60"></div>
        
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo Section */}
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gaming-gold/20 rounded-full blur-xl group-hover:bg-gaming-gold/30 transition-all duration-500"></div>
                <img 
                  src={serverLogo} 
                  alt="Legion Plus" 
                  className="relative w-14 h-14 object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="group-hover:translate-x-2 transition-transform duration-300">
                <h1 className="text-2xl font-gaming font-bold bg-gradient-to-r from-gaming-gold via-yellow-300 to-gaming-gold bg-clip-text text-transparent">
                  Legion Plus
                </h1>
                <p className="text-sm font-medium bg-gradient-to-r from-gaming-gold/80 to-yellow-400/80 bg-clip-text text-transparent">
                  x7 Server • Expansión Legion
                </p>
              </div>
            </div>

            {/* Modern Server Status Panel */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-3 bg-green-500/10 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/20">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-30"></div>
                </div>
                <span className="text-sm font-semibold text-green-300">Servidor Online</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gaming-gold/10 backdrop-blur-sm rounded-full px-6 py-2 border border-gaming-gold/30">
                <Users className="w-5 h-5 text-gaming-gold animate-pulse" />
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-gaming-gold to-yellow-300 bg-clip-text text-transparent" data-testid="text-player-count">
                    247
                  </span>
                  <span className="text-sm font-medium text-gaming-gold/80">jugadores conectados</span>
                </div>
              </div>
            </div>

            {/* Sleek Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                <Link href="/">
                  <Button variant="ghost" className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" data-testid="link-inicio">
                    🏠 Inicio
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-noticias"
                  onClick={handleNoticiasClick}
                >
                  📰 Noticias
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-rankings"
                  onClick={handleRankingsClick}
                >
                  🏆 Rankings
                </Button>
                <Link href="/foro">
                  <Button variant="ghost" className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" data-testid="link-foro">
                    💬 Foro
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-descargar"
                  onClick={() => setDownloadOpen(true)}
                >
                  📥 Descargar
                </Button>
              </div>
              
              {/* Premium Actions */}
              <div className="flex items-center gap-2 ml-3">
                <Button 
                  variant="ghost" 
                  className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 rounded-full font-medium transition-all duration-300" 
                  data-testid="link-donacion"
                >
                  <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                  Donación
                </Button>
                <Button 
                  variant="ghost" 
                  className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-full font-medium transition-all duration-300" 
                  data-testid="link-tienda"
                >
                  <ShoppingBag className="w-4 h-4 mr-2 text-purple-400" />
                  Tienda
                </Button>
              </div>
            </nav>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hidden sm:flex gap-3 bg-gaming-gold/10 hover:bg-gaming-gold/20 border border-gaming-gold/30 rounded-full px-4 py-2 transition-all duration-300" 
                        data-testid="button-user-menu"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-400 flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-semibold bg-gradient-to-r from-gaming-gold to-yellow-300 bg-clip-text text-transparent">
                          {user?.username}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-gray-900/95 backdrop-blur-xl border-gaming-gold/20">
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
                    className="bg-gradient-to-r from-gaming-gold via-yellow-400 to-gaming-gold hover:from-yellow-400 hover:via-gaming-gold hover:to-yellow-400 text-black font-bold rounded-full px-6 py-3 shadow-xl shadow-gaming-gold/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    ¡JUGAR AHORA!
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex bg-white/5 hover:bg-white/10 border border-white/20 rounded-full font-medium transition-all duration-300" 
                    onClick={() => setLoginOpen(true)}
                    data-testid="button-login"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex bg-gaming-gold/10 hover:bg-gaming-gold/20 border-gaming-gold/30 text-gaming-gold hover:text-gaming-gold rounded-full font-medium transition-all duration-300" 
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
                    className="bg-gradient-to-r from-gaming-gold via-yellow-400 to-gaming-gold hover:from-yellow-400 hover:via-gaming-gold hover:to-yellow-400 text-black font-bold rounded-full px-6 py-3 shadow-xl shadow-gaming-gold/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    ¡JUGAR AHORA!
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subtle bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gaming-gold/50 to-transparent"></div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-24"></div>
      
      {/* Modals */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
      <RegistrationModal open={registrationOpen} onOpenChange={setRegistrationOpen} />
      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={handleLoginSuccess} />
    </header>
  );
}