import ArcRow from "./ArcRow";
import type { ArcItem } from "./types";
import { useTranslations } from "next-intl";

interface ArcListProps {
  arcs: ArcItem[];
  onSelectArc: (arcId: string) => void;
}

export default function ArcList({ arcs, onSelectArc }: ArcListProps) {
  const t = useTranslations("Manga");
  if (arcs.length === 0) {
    return <p className="text-sm text-fg-secondary">{t("noArcs")}</p>;
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {arcs.map((arc) => (
        <ArcRow key={arc.id} arc={arc} onSelect={onSelectArc} />
      ))}
    </div>
  );
}
