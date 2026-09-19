import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import ChapterFavoriteButton from "./ChapterFavoriteButton";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
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
      className="h-18 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200"
    >
      {/* Mobile: width is driven by aspect-video off the row's own height
          instead of a fixed w-24 — that used to crop the 16:9 chapter
          cover into a near-square box. Desktop keeps its existing
          fixed-width column (sm:aspect-auto cancels the ratio there). */}
      <div className="relative aspect-video sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-[#1b1a1c]">
        {chapter.cover_image_url ? (
          <>
            <Image
              src={chapter.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 128px, 216px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 w-full pr-3 sm:pr-8">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-md sm:text-lg text-[#ece6d8] group-hover:text-[#f2f0f0] transition-colors duration-200 shrink-0">
              {formatChapterBadge(chapter.chapter_is_ex, displayNumber)}
            </span>
            <span className="text-xs sm:text-sm text-[#b6b0a2] whitespace-nowrap">
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
        <div className="flex items-center gap-3 mt-1 text-xs text-[#6b655e]">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {chapter.favoriteCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {chapter.commentCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}