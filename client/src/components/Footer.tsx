import { Button } from "@/components/ui/button";

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
      <div className="container mx-auto px-4 py-6">
        
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