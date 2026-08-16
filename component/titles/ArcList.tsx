import ArcRow from "./ArcRow";
import type { ArcItem } from "./types";

export default function ArcList({ arcs }: { arcs: ArcItem[] }) {
  if (arcs.length === 0) {
    return <p className="text-sm text-[#b6b0a2] font-mono">No arcs yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {arcs.map((arc) => (
        <ArcRow key={arc.id} arc={arc} />
      ))}
    </div>
  );
}
