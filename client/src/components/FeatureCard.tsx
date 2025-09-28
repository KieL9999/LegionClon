import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  type: "Action" | "Event" | "Feature";
  category?: "raids" | "pvp" | "pve" | "social" | "shop";
}

const typeColors = {
  Action: "bg-gaming-horde",
  Event: "bg-gaming-alliance", 
  Feature: "bg-gaming-emerald"
};

export default function FeatureCard({ image, title, description, type, category }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group cursor-pointer transition-all duration-300" data-testid={`card-feature-${category || 'default'}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className={`${typeColors[type]} text-white font-medium`}>
            {type}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-gaming-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}