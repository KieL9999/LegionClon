import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Shield, Download, Users, ExternalLink } from "lucide-react";
import { SiDiscord, SiFacebook, SiX } from "react-icons/si";
import serverLogo from "@assets/generated_images/Legion_gaming_server_logo_63d36140.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string) => {
    console.log(`${platform} link clicked`);
    // TODO: Remove mock functionality - implement real social links
  };

  const handleLinkClick = (link: string) => {
    console.log(`${link} link clicked`);
    // TODO: Remove mock functionality - implement real navigation
  };

  return (
    <footer className="bg-card/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={serverLogo} 
                alt="AetherWoW" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h3 className="text-xl font-gaming font-bold text-gaming-gold">
                  AetherWoW
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              La mejor experiencia de World of Warcraft Legion con contenido personalizado, 
              jefes únicos y una comunidad activa que te espera.
            </p>
          </div>


          {/* Social & Community */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Comunidad</h4>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="border-gaming-alliance/30 hover:border-gaming-alliance hover:bg-gaming-alliance/10"
                onClick={() => handleSocialClick('Discord')}
                data-testid="social-discord"
              >
                <SiDiscord className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10"
                onClick={() => handleSocialClick('Facebook')}
                data-testid="social-facebook"
              >
                <SiFacebook className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="border-gray-400/30 hover:border-gray-400 hover:bg-gray-400/10"
                onClick={() => handleSocialClick('X')}
                data-testid="social-x"
              >
                <SiX className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="ghost" 
                className="justify-start p-0 h-auto text-muted-foreground hover:text-gaming-gold"
                onClick={() => handleLinkClick('foros')}
                data-testid="footer-link-foros"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Foros de la Comunidad
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AetherWoW. Todos los derechos reservados. 
            World of Warcraft es una marca registrada de Blizzard Entertainment.
          </p>
          <div className="flex gap-4 text-sm">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-muted-foreground hover:text-gaming-gold"
              onClick={() => handleLinkClick('terminos')}
              data-testid="footer-link-terminos"
            >
              Términos de Servicio
            </Button>
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-muted-foreground hover:text-gaming-gold"
              onClick={() => handleLinkClick('privacidad')}
              data-testid="footer-link-privacidad"
            >
              Política de Privacidad
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}