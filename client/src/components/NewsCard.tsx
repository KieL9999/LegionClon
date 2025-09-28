import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface NewsCardProps {
  image: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  publishedAt: string;
  onClick?: () => void;
}

const priorityColors = {
  low: "bg-gray-500",
  normal: "bg-blue-500", 
  high: "bg-orange-500",
  urgent: "bg-red-500"
};

const priorityLabels = {
  low: "Baja",
  normal: "Normal",
  high: "Alta", 
  urgent: "Urgente"
};

const categoryLabels = {
  general: "General",
  updates: "Actualizaciones",
  events: "Eventos",
  maintenance: "Mantenimiento",
  patches: "Parches",
  announcements: "Anuncios"
};

export default function NewsCard({ 
  image, 
  title, 
  summary, 
  content, 
  category, 
  priority, 
  publishedAt, 
  onClick 
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityIcon = () => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertTriangle className="w-3 h-3" />;
    }
    return null;
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate group cursor-pointer transition-all duration-300" 
      onClick={onClick}
      data-testid={`card-news-${category}`}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge 
            variant="secondary" 
            className="bg-gaming-emerald text-white font-medium"
          >
            {categoryLabels[category as keyof typeof categoryLabels] || category}
          </Badge>
          {priority !== 'normal' && (
            <div className="flex items-center gap-1">
              {getPriorityIcon()}
              <Badge 
                variant="secondary" 
                className={`text-white font-medium ${priorityColors[priority]}`}
              >
                {priorityLabels[priority]}
              </Badge>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(publishedAt)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>Hace {Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24))} días</span>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-gaming-gold transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {summary}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gaming-gold font-medium group-hover:underline">
            Leer más →
          </span>
          
          {priority === 'urgent' && (
            <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>¡Urgente!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}