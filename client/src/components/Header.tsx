import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Shield, Users, LogIn, LogOut, User, DollarSign, ShoppingBag, Settings, Calendar } from "lucide-react";
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
            {/* Enhanced Server Status Panel */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                {/* Background with subtle gradient and glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-gaming-gold/5 via-gaming-gold/10 to-gaming-gold/5 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative flex items-center gap-4 bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl px-8 py-4 border border-gaming-gold/20 shadow-xl">
                  {/* Icon with enhanced styling */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gaming-gold/30 rounded-full blur-md"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-gaming-gold/20 to-yellow-400/20 rounded-full flex items-center justify-center border border-gaming-gold/30">
                      <Users className="w-6 h-6 text-gaming-gold" />
                    </div>
                  </div>
                  
                  {/* Content with improved typography - centered */}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-gaming-gold via-yellow-300 to-gaming-gold bg-clip-text text-transparent tracking-tight" data-testid="text-player-count">
                        247
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gaming-gold/60 uppercase tracking-wide">
                      Jugadores Conectados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Symmetric Navigation */}
            <nav className="hidden lg:flex items-center gap-2 ml-8">
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                <Link href="/">
                  <Button variant="ghost" className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" data-testid="link-inicio">
                    Inicio
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-noticias"
                  onClick={handleNoticiasClick}
                >
                  Noticias
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-rankings"
                  onClick={handleRankingsClick}
                >
                  Rankings
                </Button>
                <Link href="/foro">
                  <Button variant="ghost" className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" data-testid="link-foro">
                    Foro
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover:bg-gaming-gold/20 hover:text-gaming-gold transition-all duration-300 font-medium" 
                  data-testid="link-descargar"
                  onClick={() => setDownloadOpen(true)}
                >
                  Descargar
                </Button>
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
            <div className="flex items-center gap-4 ml-8">
              {isAuthenticated ? (
                <>
                  {/* Integrated Player Dashboard - Always Visible */}
                  <div className="hidden xl:flex items-center gap-4">
                    {/* Player Info Section */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl px-4 py-2 border border-gaming-gold/20 shadow-xl">
                      {/* User Avatar & Name */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-400 flex items-center justify-center shadow-lg">
                          <User className="w-4 h-4 text-black" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold bg-gradient-to-r from-gaming-gold to-yellow-300 bg-clip-text text-transparent text-sm leading-tight">
                            {user?.username}
                          </span>
                          <span className="text-xs text-gaming-gold/60 uppercase tracking-wide leading-tight">
                            {user?.role === 'administrador' ? 'Admin' : 
                             user?.role?.includes('gm') ? 'GM' : 'Jugador'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Player Stats Cards */}
                    <div className="flex items-center gap-2">
                      {/* Coins */}
                      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl px-3 py-2 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">💰</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-yellow-500 leading-tight">{user?.coins || 0}</span>
                            <span className="text-xs text-yellow-300/80 leading-tight">Monedas</span>
                          </div>
                        </div>
                      </div>

                      {/* VIP Level */}
                      <div className={`bg-gradient-to-r border rounded-xl px-3 py-2 backdrop-blur-sm ${
                        user?.vipLevel === 0 ? 'from-gray-500/20 to-gray-500/5 border-gray-500/30' :
                        user?.vipLevel === 1 ? 'from-amber-600/20 to-amber-600/5 border-amber-600/30' :
                        user?.vipLevel === 2 ? 'from-gray-400/20 to-gray-400/5 border-gray-400/30' :
                        user?.vipLevel === 3 ? 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30' :
                        user?.vipLevel === 4 ? 'from-cyan-400/20 to-cyan-400/5 border-cyan-400/30' :
                        'from-purple-500/20 to-purple-500/5 border-purple-500/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user?.vipLevel || 0}</span>
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold leading-tight ${
                              user?.vipLevel === 0 ? 'text-gray-500' :
                              user?.vipLevel === 1 ? 'text-amber-600' :
                              user?.vipLevel === 2 ? 'text-gray-400' :
                              user?.vipLevel === 3 ? 'text-yellow-500' :
                              user?.vipLevel === 4 ? 'text-cyan-400' :
                              'text-purple-500'
                            }`}>VIP {user?.vipLevel || 0}</span>
                            <span className="text-xs text-white/60 leading-tight">Nivel</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div className={`bg-gradient-to-r border rounded-xl px-3 py-2 backdrop-blur-sm ${
                        user?.isBanned ? 'from-red-500/20 to-red-500/5 border-red-500/30' : 'from-green-500/20 to-green-500/5 border-green-500/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Shield className={`w-3 h-3 ${user?.isBanned ? 'text-red-500' : 'text-green-500'}`} />
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold leading-tight ${user?.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                              {user?.isBanned ? 'Baneado' : 'Activo'}
                            </span>
                            <span className="text-xs text-white/60 leading-tight">Estado</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      <Link href="/panel">
                        <Button size="sm" variant="ghost" className="bg-gaming-gold/10 hover:bg-gaming-gold/20 border border-gaming-gold/30 rounded-full px-2 py-2" data-testid="button-player-panel">
                          <Settings className="w-4 h-4 text-gaming-gold" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full px-2 py-2" data-testid="button-logout">
                        <LogOut className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile/Medium Screens - Compact Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="xl:hidden flex gap-3 bg-gaming-gold/10 hover:bg-gaming-gold/20 border border-gaming-gold/30 rounded-full px-4 py-2 transition-all duration-300" 
                        data-testid="button-user-menu"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-400 flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                        <span className="hidden sm:block font-semibold bg-gradient-to-r from-gaming-gold to-yellow-300 bg-clip-text text-transparent">
                          {user?.username}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-gray-900/95 backdrop-blur-xl border-gaming-gold/20">
                      <DropdownMenuItem disabled className="text-muted-foreground">
                        Conectado como {user?.username}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {/* Mobile Player Stats */}
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-yellow-500">💰 Monedas:</span>
                          <span className="text-yellow-300 font-bold">{user?.coins || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-400">VIP:</span>
                          <span className="text-purple-300 font-bold">Nivel {user?.vipLevel || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={user?.isBanned ? 'text-red-500' : 'text-green-500'}>Estado:</span>
                          <span className={`font-bold ${user?.isBanned ? 'text-red-400' : 'text-green-400'}`}>
                            {user?.isBanned ? 'Baneado' : 'Activo'}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      
                      <Link href="/panel">
                        <DropdownMenuItem data-testid="button-player-panel">
                          <Settings className="w-4 h-4 mr-2" />
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