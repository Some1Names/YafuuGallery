import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import type { ArcItem } from "./types";

interface ArcRowProps {
  arc: ArcItem;
  onSelect: (arcId: string) => void;
}

export default function ArcRow({ arc, onSelect }: ArcRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(arc.id)}
      className="h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer text-left bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200"
    >
      <div className="relative w-24 sm:w-54 h-full overflow-hidden shrink-0 bg-[#1b1a1c]">
        {arc.arc_image_url ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${arc.arc_image_url}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 w-full pr-3 sm:pr-8">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-md sm:text-lg text-[#ece6d8] group-hover:text-[#f2f0f2] transition-colors duration-200 truncate">
            {arc.arc_name}
          </span>
          <span className="text-[11px] text-[#b6b0a2] uppercase shrink-0">{arc.arc_status}</span>
        </div>
        <div className="text-sm mt-1 text-[#ece6d8]/90 truncate">{arc.chapters.length} chapters</div>
      </div>
    </button>
  );
}
