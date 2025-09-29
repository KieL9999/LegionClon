import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Download } from "lucide-react";
import RealmistModal from "./RealmistModal";
import DownloadModal from "./DownloadModal";
import heroBackground from "@assets/generated_images/WoW_Legion_hero_background_256bfd43.png";

export default function HeroSection() {
  const [realmistOpen, setRealmistOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background - Single overlay instead of multiple gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
        <div className="mb-8">
          
          {/* Simplified title - solid color instead of gradient clip */}
          <h1 className="text-5xl md:text-7xl font-gaming font-black mb-6 text-gaming-gold">
            AetherWoW
          </h1>
          
          {/* Epic narrative text in elegant container */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative bg-black/40 backdrop-blur-sm border border-gaming-gold/30 rounded-xl p-8 md:p-10 shadow-2xl">
              {/* Decorative corner elements */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-gaming-gold/60"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-gaming-gold/60"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-gaming-gold/60"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-gaming-gold/60"></div>
              
              <div className="text-center space-y-6">
                {/* Opening war call */}
                <p className="text-xl md:text-2xl text-white font-bold">
                  ¡Guerreros de la <span className="text-red-400 font-bold">Horda</span> y la <span className="text-blue-400 font-bold">Alianza</span>!
                </p>
                
                {/* Main war narrative */}
                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                    El tambor de la guerra resuena una vez más en las tierras de <span className="text-gaming-gold font-semibold">Azeroth</span>. Antiguas heridas siguen abiertas, y aunque la paz es solo un susurro en el viento, una nueva amenaza se alza desde las sombras... una que podría consumir a ambos bandos por igual.
                  </p>
                  
                  <p className="text-lg md:text-xl text-white font-semibold">
                    El honor, la gloria y la supervivencia están en juego.
                  </p>
                  
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                    ¿Responderás al llamado del deber? ¿Lucharás por tu facción, por tu gente… o por el destino de todo un mundo?
                  </p>
                </div>
                
                {/* Final battle call */}
                <div className="space-y-3 pt-4 border-t border-gaming-gold/20">
                  <p className="text-lg md:text-xl text-white font-bold">
                    Ya seas <span className="text-red-400 font-bold">Horda</span> o <span className="text-blue-400 font-bold">Alianza</span>, tu leyenda comienza aquí.
                  </p>
                  <p className="text-xl md:text-2xl text-gaming-gold font-bold tracking-wide">
                    Bienvenido a la batalla.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimized Stats - no blur effects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-black/50 border border-gray-700 rounded-lg px-4 py-6 text-center">
            <div className="text-3xl font-bold text-gaming-gold mb-2" data-testid="text-online-count">247</div>
            <div className="text-sm text-gray-300 font-medium">Jugadores Online</div>
          </div>
          <div className="bg-black/50 border border-gray-700 rounded-lg px-4 py-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">1,523</div>
            <div className="text-sm text-gray-300 font-medium">Jugadores Últimas 24h</div>
          </div>
          <div className="bg-black/50 border border-gray-700 rounded-lg px-4 py-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">15,847</div>
            <div className="text-sm text-gray-300 font-medium">Cuentas Registradas</div>
          </div>
        </div>

        {/* Simplified CTA Buttons - no complex effects */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gaming-gold hover:bg-yellow-500 text-black font-bold px-8 py-3 text-lg"
            onClick={() => setRealmistOpen(true)}
            data-testid="button-start-play"
          >
            <Play className="w-5 h-5 mr-2" />
            ¡Comenzar a Jugar!
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-gaming-gold hover:bg-gaming-gold/10 text-white px-8 py-3 text-lg"
            onClick={() => setDownloadOpen(true)}
            data-testid="button-download-client"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar Cliente
          </Button>
        </div>

      </div>
      
      {/* Modals */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} />
    </section>
  );
}