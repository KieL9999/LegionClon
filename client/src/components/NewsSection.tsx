import { Button } from "@/components/ui/button";
import { ChevronRight, Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";
import heroImage from "@assets/generated_images/WoW_Legion_hero_background_256bfd43.png";
import raidImage from "@assets/generated_images/Fated_raids_screenshot_916448c2.png";
import bossImage from "@assets/generated_images/Custom_boss_artwork_08a9df2f.png";

// TODO: Remove mock data when implementing real news system
const mockNews = [
  {
    id: 1,
    title: "Legion Plus: El futuro de los servidores privados de Legion",
    excerpt: "Descubre las últimas actualizaciones y mejoras que hemos implementado para ofrecer la mejor experiencia de World of Warcraft Legion. Nuevas características, contenido personalizado y mucho más te espera.",
    date: "18.08.2025",
    image: heroImage,
    slug: "legion-plus-futuro-servidores-legion"
  },
  {
    id: 2,
    title: "Carreras de Realm First y otras noticias",
    excerpt: "¡Las carreras por los Realm First han comenzado! Conoce a los competidores y las recompensas exclusivas que están en juego. Además, nuevas actualizaciones del servidor.",
    date: "27.07.2025",
    image: raidImage,
    slug: "carreras-realm-first-noticias"
  },
  {
    id: 3,
    title: "Fecha oficial de lanzamiento",
    excerpt: "¡Es oficial! Te contamos todos los detalles sobre el gran lanzamiento de Legion Plus, las preparaciones finales y qué puedes esperar en los primeros días.",
    date: "13.07.2025",
    image: bossImage,
    slug: "fecha-oficial-lanzamiento"
  }
];

export default function NewsSection() {
  const handleViewAllNews = () => {
    console.log('View all news clicked');
    // TODO: Remove mock functionality - implement real navigation
  };

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-gaming-gold" />
              <h2 className="text-4xl md:text-5xl font-gaming font-bold text-foreground">
                Noticias del Proyecto
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Mantente al día con las últimas actualizaciones y eventos
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black mt-6 md:mt-0"
            onClick={handleViewAllNews}
            data-testid="button-view-all-news"
          >
            Ver todas las noticias
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNews.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              image={article.image}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}