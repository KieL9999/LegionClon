import RankingTable from '../RankingTable';
import { Swords } from 'lucide-react';

// TODO: Remove mock data when implementing real ranking system
const mockPlayers = [
  { rank: 1, name: "Kaede", faction: "Horde" as const, class: "Death Knight", score: 5725.7 },
  { rank: 2, name: "Tank", faction: "Alliance" as const, class: "Death Knight", score: 5725.7 },
  { rank: 3, name: "Mushao", faction: "Horde" as const, class: "Death Knight", score: 5573.21 },
  { rank: 4, name: "Meero", faction: "Horde" as const, class: "Warlock", score: 5468.11 },
  { rank: 5, name: "蔷薇少女", faction: "Alliance" as const, class: "Paladin", score: 5258.62 },
];

export default function RankingTableExample() {
  return (
    <div className="max-w-2xl">
      <RankingTable 
        title="Mejores Asesinos"
        type="killers"
        players={mockPlayers}
        icon={<Swords className="w-5 h-5" />}
      />
    </div>
  );
}