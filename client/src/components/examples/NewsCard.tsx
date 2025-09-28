import NewsCard from '../NewsCard';
import newsImage from "@assets/generated_images/WoW_Legion_hero_background_256bfd43.png";

export default function NewsCardExample() {
  return (
    <div className="max-w-sm">
      <NewsCard 
        id={1}
        title="Legion Plus: El futuro de los servidores privados de Legion"
        excerpt="Descubre las últimas actualizaciones y mejoras que hemos implementado para ofrecer la mejor experiencia de World of Warcraft Legion."
        date="18.08.2025"
        image={newsImage}
        slug="legion-plus-futuro-servidores-legion"
      />
    </div>
  );
}