import NewsCard from '../NewsCard';
import newsImage from "@assets/generated_images/WoW_Legion_hero_background_256bfd43.png";

export default function NewsCardExample() {
  return (
    <div className="max-w-sm">
      <NewsCard 
        title="AetherWoW: El futuro de los servidores privados de Legion"
        summary="Descubre las últimas actualizaciones y mejoras que hemos implementado para ofrecer la mejor experiencia de World of Warcraft Legion."
        content="Contenido completo de la noticia sobre las mejoras implementadas en AetherWoW."
        category="updates"
        priority="high"
        publishedAt="2025-08-18"
        image={newsImage}
      />
    </div>
  );
}