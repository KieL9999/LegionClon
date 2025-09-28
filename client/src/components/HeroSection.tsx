import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Download } from "lucide-react";
import RealmistModal from "./RealmistModal";
import heroBackground from "@assets/generated_images/WoW_Legion_hero_background_256bfd43.png";

export default function HeroSection() {
  const [realmistOpen, setRealmistOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-gaming-gold/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-status-online animate-pulse"></div>
            <span className="text-sm font-medium text-gaming-gold">Servidor Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-gaming font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold via-yellow-300 to-gaming-gold">
            Legion Plus
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground mb-4 font-medium">
            Únete a una aventura legendaria
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            con giros inesperados y desafíos épicos que te mantendrán al borde de tu asiento.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-center">
          <div className="bg-card/60 backdrop-blur-sm border border-card-border rounded-lg px-6 py-4">
            <div className="text-2xl font-bold text-gaming-gold" data-testid="text-online-count">247</div>
            <div className="text-sm text-muted-foreground">Jugadores Online</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-card-border rounded-lg px-6 py-4">
            <div className="text-2xl font-bold text-gaming-emerald">x7</div>
            <div className="text-sm text-muted-foreground">Rates de Experiencia</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-card-border rounded-lg px-6 py-4">
            <div className="text-2xl font-bold text-gaming-alliance">99.9%</div>
            <div className="text-sm text-muted-foreground">Tiempo Activo</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-gaming-gold to-yellow-500 hover:from-yellow-500 hover:to-gaming-gold text-black font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => setRealmistOpen(true)}
            data-testid="button-start-play"
          >
            <Play className="w-5 h-5 mr-2" />
            ¡Comenzar a Jugar!
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-background/20 backdrop-blur-sm border-2 border-gaming-gold/30 hover:border-gaming-gold text-foreground px-8 py-3 text-lg"
            onClick={() => {
              // TODO: Replace with real download functionality
              console.log('Download client clicked from hero');
            }}
            data-testid="button-download-client"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar Cliente
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gaming-gold" />
            <span>Raids Personalizados</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gaming-emerald" />
            <span>Jefes Únicos</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gaming-alliance" />
            <span>Desafío Hardcore</span>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
    </section>
  );
}