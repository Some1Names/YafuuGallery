import ArcRow from "./ArcRow";
import type { ArcItem } from "./types";

interface ArcListProps {
  arcs: ArcItem[];
  onSelectArc: (arcId: string) => void;
}

export default function ArcList({ arcs, onSelectArc }: ArcListProps) {
  if (arcs.length === 0) {
    return <p className="text-sm text-[#b6b0a2]">No arcs yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {arcs.map((arc) => (
        <ArcRow key={arc.id} arc={arc} onSelect={onSelectArc} />
      ))}
    </div>
  );
}
