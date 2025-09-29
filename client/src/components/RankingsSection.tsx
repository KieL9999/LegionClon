import { Button } from "@/components/ui/button";
import { Trophy, Swords, Clock, ChevronRight } from "lucide-react";
import RankingTable from "./RankingTable";

// TODO: Remove mock data when implementing real ranking system
const topKillers = [
  { rank: 1, name: "Kaede", faction: "Horde" as const, class: "Death Knight", score: 5725.7 },
  { rank: 2, name: "Tank", faction: "Alliance" as const, class: "Death Knight", score: 5725.7 },
  { rank: 3, name: "Mushao", faction: "Horde" as const, class: "Death Knight", score: 5573.21 },
  { rank: 4, name: "Meero", faction: "Horde" as const, class: "Warlock", score: 5468.11 },
  { rank: 5, name: "蔷薇少女", faction: "Alliance" as const, class: "Paladin", score: 5258.62 },
  { rank: 6, name: "Homeless", faction: "Horde" as const, class: "Death Knight", score: 4609.18 },
  { rank: 7, name: "Real", faction: "Alliance" as const, class: "Warlock", score: 4533.33 },
  { rank: 8, name: "Bazar", faction: "Horde" as const, class: "Demon Hunter", score: 4486.99 },
  { rank: 9, name: "Sorceress", faction: "Horde" as const, class: "Mage", score: 4405.72 },
  { rank: 10, name: "Kekwpriest", faction: "Alliance" as const, class: "Priest", score: 4387.69 }
];

const topOnline = [
  { rank: 1, name: "蔷薇少女", faction: "Alliance" as const, class: "Paladin", score: 445.539 },
  { rank: 2, name: "Kaede", faction: "Horde" as const, class: "Death Knight", score: 445.539 },
  { rank: 3, name: "Tank", faction: "Alliance" as const, class: "Death Knight", score: 445.539 },
  { rank: 4, name: "Ggboom", faction: "Horde" as const, class: "Death Knight", score: 445.539 },
  { rank: 5, name: "蔷薇少女", faction: "Alliance" as const, class: "Paladin", score: 430.405 },
  { rank: 6, name: "Mushao", faction: "Horde" as const, class: "Death Knight", score: 430.405 },
  { rank: 7, name: "Tank", faction: "Alliance" as const, class: "Death Knight", score: 430.405 },
  { rank: 8, name: "蔷薇少女", faction: "Alliance" as const, class: "Paladin", score: 399.574 },
  { rank: 9, name: "Tank", faction: "Alliance" as const, class: "Death Knight", score: 399.574 },
  { rank: 10, name: "Meero", faction: "Horde" as const, class: "Warlock", score: 399.574 }
];

export default function RankingsSection() {
  const handleViewRanking = () => {
    console.log('View ranking page clicked');
    // TODO: Remove mock functionality - implement real navigation
  };

  return (
    <section id="rankings" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-gaming-gold" />
              <h2 className="text-4xl md:text-5xl font-gaming font-bold text-foreground">
                Los Mejores Jugadores
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Compite por la gloria y demuestra tu dominio en AetherWoW
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black mt-6 md:mt-0"
            onClick={handleViewRanking}
            data-testid="button-view-rankings"
          >
            Ver página de rankings
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingTable
            title="Mejores Asesinos"
            type="killers"
            players={topKillers}
            icon={<Swords className="w-5 h-5" />}
          />
          
          <RankingTable
            title="Mejor Tiempo Online"
            type="online"
            players={topOnline}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>
    </section>
  );
}