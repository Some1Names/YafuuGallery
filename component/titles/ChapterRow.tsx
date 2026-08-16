import ChapterFavoriteButton from "./ChapterFavoriteButton";
import type { ChapterItem } from "./types";

interface ChapterRowProps {
  chapter: ChapterItem;
  isFavorited?: boolean;
}

export default function ChapterRow({ chapter, isFavorited = false }: ChapterRowProps) {
  return (
    <div className="h-27 group flex items-center gap-8 cursor-pointer bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200">
      <div className="relative w-50 h-full overflow-hidden shrink-0 bg-[#ece6d8]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
      </div>

      <div className="min-w-0 w-full pr-8">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-baseline gap-2">
            <span className="text-lg text-[#ece6d8] group-hover:text-[#f2f0f0] transition-colors duration-200 font-(family-name:--font-display)">
              #{String(chapter.chapter_number).padStart(3, "0")}
            </span>
            <span className="text-[11px] text-[#b6b0a2] font-mono">
              {chapter.published_date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <ChapterFavoriteButton chapterId={chapter.id} initialFavorited={isFavorited} />
        </div>
        <div className="text-sm mt-1 text-[#ece6d8]/90 truncate">{chapter.chapter_name}</div>
      </div>
    </div>
  );
}