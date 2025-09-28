import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Swords, Clock } from "lucide-react";

interface Player {
  rank: number;
  name: string;
  faction: "Alliance" | "Horde";
  class: string;
  score: number;
}

interface RankingTableProps {
  title: string;
  type: "killers" | "online";
  players: Player[];
  icon?: React.ReactNode;
}

const factionColors = {
  Alliance: "text-gaming-alliance",
  Horde: "text-gaming-horde"
};

const classColors = {
  "Death Knight": "bg-purple-600",
  "Paladin": "bg-pink-500",
  "Warlock": "bg-purple-700",
  "Demon Hunter": "bg-green-600",
  "Mage": "bg-blue-500",
  "Priest": "bg-white text-black",
  "Warrior": "bg-yellow-600",
  "Hunter": "bg-green-500",
  "Rogue": "bg-yellow-500",
  "Shaman": "bg-blue-600",
  "Druid": "bg-orange-500",
  "Monk": "bg-green-400"
};

export default function RankingTable({ title, type, players, icon }: RankingTableProps) {
  return (
    <Card className="hover-elevate" data-testid={`table-ranking-${type}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gaming-gold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Jugador</div>
            <div className="col-span-2">Facción</div>
            <div className="col-span-3">Clase</div>
            <div className="col-span-2 text-right">Puntuación</div>
          </div>
          
          {/* Players */}
          {players.map((player) => (
            <div 
              key={`${player.rank}-${player.name}`}
              className="grid grid-cols-12 gap-2 items-center hover:bg-accent/50 rounded-md p-2 transition-colors duration-200"
              data-testid={`row-player-${player.rank}`}
            >
              <div className="col-span-1">
                <div className="flex items-center justify-center">
                  {player.rank <= 3 ? (
                    <Trophy className={`w-4 h-4 ${
                      player.rank === 1 ? 'text-gaming-gold' :
                      player.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                    }`} />
                  ) : (
                    <span className="text-sm font-medium">{player.rank}</span>
                  )}
                </div>
              </div>
              
              <div className="col-span-4">
                <span className="font-medium text-foreground" data-testid={`text-player-name-${player.rank}`}>
                  {player.name}
                </span>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    player.faction === 'Alliance' ? 'bg-gaming-alliance' : 'bg-gaming-horde'
                  }`}></div>
                  <span className={`text-xs ${factionColors[player.faction]}`}>
                    {player.faction}
                  </span>
                </div>
              </div>
              
              <div className="col-span-3">
                <Badge 
                  variant="secondary"
                  className={`${classColors[player.class as keyof typeof classColors] || 'bg-gray-600'} text-xs font-medium`}
                >
                  {player.class}
                </Badge>
              </div>
              
              <div className="col-span-2 text-right">
                <span className="font-bold text-gaming-gold" data-testid={`text-player-score-${player.rank}`}>
                  {player.score.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}