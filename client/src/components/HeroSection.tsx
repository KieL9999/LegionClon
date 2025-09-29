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
          {/* Simplified server status - no blur effect */}
          <div className="inline-flex items-center gap-2 bg-black/40 border border-gaming-gold/40 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gaming-gold">Servidor Online</span>
          </div>
          
          {/* Simplified title - solid color instead of gradient clip */}
          <h1 className="text-5xl md:text-7xl font-gaming font-black mb-6 text-gaming-gold">
            Legion Plus
          </h1>
          
          {/* Epic narrative text with beautiful styling */}
          <div className="text-center space-y-6 mb-8">
            {/* Opening salutation */}
            <p className="text-xl md:text-2xl text-white font-semibold">
              Bienvenidos a las tierras de <span className="text-gaming-gold font-bold">Azerion</span>, <span className="text-blue-400 font-bold">campeones</span>.
            </p>
            
            {/* Main epic description */}
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Un mundo devastado por la <span className="text-red-400 font-semibold">guerra</span>, marcado por antiguas <span className="text-purple-400 font-semibold">profecías</span> y forjado por el <span className="text-gray-300 font-semibold">acero</span> de los valientes. Aquí, la <span className="text-gray-500 font-semibold">oscuridad</span> no duerme… y la <span className="text-gaming-gold font-semibold">gloria</span> es solo para los dignos.
              </p>
              
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                Elige tu <span className="text-green-400 font-semibold">facción</span>, blande tu <span className="text-orange-400 font-semibold">arma</span> y únete a la lucha por el destino del reino. Ya sea en los <span className="text-red-300">campos de batalla</span> o en las <span className="text-purple-300">sombras de ruinas olvidadas</span>, cada decisión forja tu <span className="text-gaming-gold font-semibold">leyenda</span>.
              </p>
            </div>
            
            {/* Call to action finale */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-white font-bold">
                Prepárate, <span className="text-red-400 font-bold">guerrero</span> — tu historia comienza ahora.
              </p>
              <p className="text-xl md:text-2xl text-gaming-gold font-bold tracking-wide">
                <span className="text-gaming-gold">Azerion</span> te espera.
              </p>
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

        {/* Simplified Features Preview */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gaming-gold" />
            <span>Raids Personalizados</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span>Jefes Únicos</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Desafío Hardcore</span>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <RealmistModal open={realmistOpen} onOpenChange={setRealmistOpen} />
      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} />
    </section>
  );
}