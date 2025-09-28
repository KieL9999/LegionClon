import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";

interface NewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug?: string;
}

export default function NewsCard({ title, excerpt, date, image, slug }: NewsCardProps) {
  const handleReadMore = () => {
    console.log('Read more clicked for:', title);
    // TODO: Remove mock functionality - implement real navigation
  };

  return (
    <Card className="overflow-hidden hover-elevate group cursor-pointer transition-all duration-300" data-testid="card-news">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-gaming-gold transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <Button 
          variant="ghost" 
          className="p-0 h-auto text-gaming-gold hover:text-yellow-400 font-medium group/btn"
          onClick={handleReadMore}
          data-testid="button-read-more"
        >
          Leer completo
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}