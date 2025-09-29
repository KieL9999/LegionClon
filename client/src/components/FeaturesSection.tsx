import { useQuery } from "@tanstack/react-query";
import FeatureCard from "./FeatureCard";
import fatedRaids from "@assets/generated_images/Fated_raids_screenshot_916448c2.png";
import customBoss from "@assets/generated_images/Custom_boss_artwork_08a9df2f.png";
import classRebalance from "@assets/generated_images/Class_rebalance_interface_382ab3d1.png";
import hardcoreChallenge from "@assets/generated_images/Hardcore_challenge_mode_18a30eeb.png";
import dungeonCompanions from "@assets/generated_images/Dungeon_companions_NPCs_00c5fc67.png";
import reworkedAffixes from "@assets/generated_images/Reworked_dungeon_affixes_b945495a.png";
import alliedRaces from "@assets/generated_images/Allied_races_characters_6cd2a18e.png";
import timewalking from "@assets/generated_images/Timewalking_raid_features_af0f8df6.png";
import donatorShop from "@assets/generated_images/Donator_shop_interface_53f890d2.png";
import type { WebFeature } from "@shared/schema";

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

export default function FeaturesSection() {
  // Fetch features from the database
  const { data: featuresData, isLoading, error } = useQuery<{ success: boolean; features: WebFeature[] }>({
    queryKey: ['/api/web-features'],
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="text-xl text-muted-foreground">Cargando características...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="text-xl text-muted-foreground">Error al cargar las características</div>
        </div>
      </section>
    );
  }

  const features = featuresData?.features || [];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gold mb-4">
            Características Épicas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre todas las mejoras y contenido personalizado que hacen de AetherWoW una experiencia única
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              image={resolveImageUrl(feature.image)}
              title={feature.title}
              description={feature.description}
              type={feature.type as "Action" | "Event" | "Feature"}
              category={feature.category as "raids" | "pvp" | "pve" | "social" | "shop"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}