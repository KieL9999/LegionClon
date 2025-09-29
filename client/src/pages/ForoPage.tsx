import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Calendar, Pin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import RegistrationModal from "@/components/RegistrationModal";

export default function ForoPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  
  const handleLoginSuccess = (user: any) => {
    console.log("Usuario logueado desde foro:", user);
  };

  const forumSections = [
    {
      id: 1,
      title: "Anuncios Oficiales",
      description: "Noticias importantes y actualizaciones del servidor",
      topics: 15,
      posts: 142,
      lastPost: "Hace 2 horas",
      pinned: true,
      color: "bg-gaming-gold"
    },
    {
      id: 2,
      title: "Guías y Tutoriales",
      description: "Aprende todo sobre AetherWoW con nuestras guías",
      topics: 87,
      posts: 523,
      lastPost: "Hace 1 día",
      pinned: false,
      color: "bg-primary"
    },
    {
      id: 3,
      title: "Discusión General",
      description: "Habla sobre WoW Legion y el servidor",
      topics: 234,
      posts: 1847,
      lastPost: "Hace 30 min",
      pinned: false,
      color: "bg-secondary"
    },
    {
      id: 4,
      title: "Soporte Técnico",
      description: "¿Tienes problemas? Aquí te ayudamos",
      topics: 156,
      posts: 892,
      lastPost: "Hace 4 horas",
      pinned: false,
      color: "bg-destructive"
    },
    {
      id: 5,
      title: "Sugerencias",
      description: "Comparte tus ideas para mejorar el servidor",
      topics: 98,
      posts: 445,
      lastPost: "Hace 1 día",
      pinned: false,
      color: "bg-muted"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-gaming font-bold mb-4 text-gaming-gold">
              Foro de la Comunidad
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conecta con otros jugadores, comparte estrategias y mantente al día con las últimas noticias de AetherWoW
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-gaming-gold" />
                <div className="text-2xl font-bold text-gaming-gold" data-testid="text-total-members">
                  1,247
                </div>
                <p className="text-sm text-muted-foreground">Miembros</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-primary" data-testid="text-total-topics">
                  590
                </div>
                <p className="text-sm text-muted-foreground">Temas</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-secondary-foreground" />
                <div className="text-2xl font-bold" data-testid="text-total-posts">
                  3,849
                </div>
                <p className="text-sm text-muted-foreground">Publicaciones</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold" data-testid="text-online-now">
                  64
                </div>
                <p className="text-sm text-muted-foreground">En línea</p>
              </CardContent>
            </Card>
          </div>

          {/* Forum Sections */}
          <div className="space-y-4">
            <h2 className="text-2xl font-gaming font-bold mb-6 text-gaming-gold">
              Secciones del Foro
            </h2>
            
            {forumSections.map((section) => (
              <Card key={section.id} className="bg-card/60 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 cursor-pointer" data-testid={`card-forum-section-${section.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {section.pinned && (
                        <Pin className="w-5 h-5 text-gaming-gold" data-testid="icon-pinned" />
                      )}
                      <div className={`w-4 h-4 rounded-full ${section.color}`}></div>
                      <div>
                        <CardTitle className="text-lg font-gaming" data-testid={`text-section-title-${section.id}`}>
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground" data-testid={`text-section-description-${section.id}`}>
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="font-bold text-foreground" data-testid={`text-topics-${section.id}`}>
                          {section.topics}
                        </div>
                        <div>Temas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-foreground" data-testid={`text-posts-${section.id}`}>
                          {section.posts}
                        </div>
                        <div>Posts</div>
                      </div>
                      <div className="text-center min-w-24">
                        <div className="text-xs" data-testid={`text-last-post-${section.id}`}>
                          {section.lastPost}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Login Prompt for Guest Users */}
          <Card className="mt-12 bg-gradient-to-r from-gaming-gold/10 to-primary/10 border-gaming-gold/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-gaming font-bold mb-4 text-gaming-gold">
                ¡Únete a la Conversación!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Inicia sesión o crea una cuenta para participar en las discusiones, crear temas y conectar con otros jugadores de AetherWoW.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gaming-gold hover:bg-gaming-gold/90 text-black" 
                  data-testid="button-login-forum"
                  onClick={() => setLoginOpen(true)}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gaming-gold text-gaming-gold hover:bg-gaming-gold/10" 
                  data-testid="button-register-forum"
                  onClick={() => setRegistrationOpen(true)}
                >
                  Crear Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      {/* Modals */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={handleLoginSuccess} />
      <RegistrationModal open={registrationOpen} onOpenChange={setRegistrationOpen} />
    </div>
  );
}