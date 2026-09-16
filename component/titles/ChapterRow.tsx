import Link from "next/link";
import ChapterFavoriteButton from "./ChapterFavoriteButton";
import { formatChapterBadge } from "@/lib/chapter-number";
import type { ChapterItem } from "./types";

interface ChapterRowProps {
  chapter: ChapterItem;
  displayNumber: number;
  isFavorited?: boolean;
}

export default function ChapterRow({ chapter, displayNumber, isFavorited = false }: ChapterRowProps) {
  return (
    <Link
      href={`/viewer/${chapter.id}`}
      className="h-24 sm:h-30 group flex items-center gap-8 cursor-pointer bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200"
    >
      <div className="relative w-40 sm:w-54 h-full overflow-hidden shrink-0 bg-[#1b1a1c]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
      </div>

      <div className="min-w-0 w-full pr-8">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-baseline gap-2">
            <span className="text-md sm:text-lg text-[#ece6d8] group-hover:text-[#f2f0f0] transition-colors duration-200">
              {formatChapterBadge(chapter.chapter_is_ex, displayNumber)}
            </span>
            <span className="text-xs sm:text-sm text-[#b6b0a2]">
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
    </Link>
  );
}