import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Newspaper, Calendar } from "lucide-react";
import NewsCard from "./NewsCard";
import fatedRaids from "@assets/generated_images/Fated_raids_screenshot_916448c2.png";
import customBoss from "@assets/generated_images/Custom_boss_artwork_08a9df2f.png";
import classRebalance from "@assets/generated_images/Class_rebalance_interface_382ab3d1.png";
import hardcoreChallenge from "@assets/generated_images/Hardcore_challenge_mode_18a30eeb.png";
import dungeonCompanions from "@assets/generated_images/Dungeon_companions_NPCs_00c5fc67.png";
import reworkedAffixes from "@assets/generated_images/Reworked_dungeon_affixes_b945495a.png";
import alliedRaces from "@assets/generated_images/Allied_races_characters_6cd2a18e.png";
import timewalking from "@assets/generated_images/Timewalking_raid_features_af0f8df6.png";
import donatorShop from "@assets/generated_images/Donator_shop_interface_53f890d2.png";
import type { ServerNews } from "@shared/schema";

// Image mapping for the database image names
const imageMap: Record<string, string> = {
  fatedRaids,
  customBoss,
  classRebalance,
  hardcoreChallenge,
  dungeonCompanions,
  reworkedAffixes,
  alliedRaces,
  timewalking,
  donatorShop,
};

// Function to resolve image URL based on type
function resolveImageUrl(imageValue: string): string {
  // Check if it's a full URL (starts with http:// or https://)
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    return imageValue;
  }
  
  // Check if it's an uploaded file (starts with /uploads/)
  if (imageValue.startsWith('/uploads/')) {
    return imageValue;
  }
  
  // Check if it's a predefined image name
  if (imageMap[imageValue]) {
    return imageMap[imageValue];
  }
  
  // Default fallback
  return fatedRaids;
}

export default function NewsSection() {
  const [selectedNews, setSelectedNews] = useState<ServerNews | null>(null);

  // Fetch news from the database
  const { data: newsData, isLoading, error } = useQuery<{ success: boolean; news: ServerNews[] }>({
    queryKey: ['/api/server-news'],
  });

  const handleViewAllNews = () => {
    console.log('View all news clicked');
    // TODO: Implement navigation to news page
  };

  const handleNewsClick = (news: ServerNews) => {
    setSelectedNews(news);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto text-center">
          <div className="text-xl text-muted-foreground">Cargando noticias...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto text-center">
          <div className="text-xl text-muted-foreground">Error al cargar las noticias</div>
        </div>
      </section>
    );
  }

  const news = newsData?.news || [];
  const displayNews = news.slice(0, 3); // Show only first 3 news items

  return (
    <>
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Newspaper className="w-8 h-8 text-gaming-gold" />
                <h2 className="text-4xl md:text-5xl font-gaming font-bold text-foreground">
                  Noticias del Servidor
                </h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Mantente al día con las últimas actualizaciones y eventos
              </p>
            </div>
            
            {news.length > 3 && (
              <Button 
                variant="outline" 
                className="border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black mt-6 md:mt-0"
                onClick={handleViewAllNews}
                data-testid="button-view-all-news"
              >
                Ver todas las noticias
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {displayNews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No hay noticias disponibles</h3>
              <p className="text-muted-foreground">
                Las noticias del servidor aparecerán aquí cuando estén disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  image={resolveImageUrl(newsItem.image)}
                  title={newsItem.title}
                  summary={newsItem.summary}
                  content={newsItem.content}
                  category={newsItem.category}
                  priority={newsItem.priority as "low" | "normal" | "high" | "urgent"}
                  publishedAt={newsItem.publishedAt!.toString()}
                  onClick={() => handleNewsClick(newsItem)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Detail Modal */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold pr-8">
                  {selectedNews.title}
                </DialogTitle>
                <DialogDescription className="text-base">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>📅 {new Date(selectedNews.publishedAt!).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}</span>
                    <span>📂 {selectedNews.category}</span>
                    <span>⚡ {selectedNews.priority}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <img 
                  src={resolveImageUrl(selectedNews.image)} 
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg font-semibold text-gaming-gold mb-4">
                    {selectedNews.summary}
                  </p>
                  
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {selectedNews.content}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}