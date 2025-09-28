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

// TODO: Remove mock data when implementing real features
const features = [
  {
    id: 1,
    image: fatedRaids,
    title: "Raids Fatales",
    description: "Hemos implementado 'raids fatales' lo que significa que hemos actualizado tanto las recompensas como la dificultad de todos los raids de Legion.",
    type: "Action" as const,
    category: "raids" as const
  },
  {
    id: 2,
    image: customBoss,
    title: "Jefes Personalizados",
    description: "Por cada jefe personalizado que tenemos, ¡obtienes recompensas únicas! incluyendo monturas, juguetes, mascotas, etc.",
    type: "Event" as const,
    category: "pve" as const
  },
  {
    id: 3,
    image: classRebalance,
    title: "Rebalanceo de Clases",
    description: "Tenemos cambios personalizados de clases, incluyendo traer talentos antiguos como Mark of Ursol para druidas guardianes, dando a guerreros furia menos daño recibido, etc.",
    type: "Feature" as const,
    category: "pvp" as const
  },
  {
    id: 4,
    image: hardcoreChallenge,
    title: "Desafío Hardcore",
    description: "Acepta el desafío hardcore, tendrás una vida, y obtendrás acceso a talentos hardcore y buffs únicos. ¿Te desmoronarás bajo el desafío?",
    type: "Event" as const,
    category: "pve" as const
  },
  {
    id: 5,
    image: dungeonCompanions,
    title: "Compañeros de Mazmorra",
    description: "Para acelerar las colas de RDF, hemos implementado compañeros de mazmorra. pueden jugar los 3 roles: sanador, tanque o dps.",
    type: "Feature" as const,
    category: "pve" as const
  },
  {
    id: 6,
    image: reworkedAffixes,
    title: "Afijos Renovados",
    description: "Hemos agregado nuevos afijos estacionales como aflicted, storming, incorporeal. Y actualizado afijos antiguos. Espera nuevos desafíos.",
    type: "Event" as const,
    category: "pve" as const
  },
  {
    id: 7,
    image: alliedRaces,
    title: "Razas Aliadas",
    description: "Juega como las nuevas razas aliadas de Battle for Azeroth y posteriores.",
    type: "Feature" as const,
    category: "social" as const
  },
  {
    id: 8,
    image: timewalking,
    title: "Características Timewalking",
    description: "Durante timewalking, tenemos raids timewalking (como Blackwing Lair, Black Temple, Ulduar, Firelands y más por venir.) Además tenemos jefes personalizados durante estos eventos.",
    type: "Event" as const,
    category: "raids" as const
  },
  {
    id: 9,
    image: donatorShop,
    title: "Tienda de Donaciones",
    description: "Tenemos una tienda de donaciones, donde puedes comprar cosméticos, mascotas, monturas, etc. Sin embargo, NUNCA venderemos el mejor equipo end-game.",
    type: "Feature" as const,
    category: "shop" as const
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gold mb-4">
            Características Épicas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre todas las mejoras y contenido personalizado que hacen de Legion Plus una experiencia única
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              image={feature.image}
              title={feature.title}
              description={feature.description}
              type={feature.type}
              category={feature.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}