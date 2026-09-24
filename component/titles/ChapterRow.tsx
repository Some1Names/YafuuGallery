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
  const publishedLabel = chapter.published_date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/viewer/${chapter.id}`}
      className="h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover transition-colors duration-200"
    >
      {/* Mobile: width is driven by an aspect ratio off the row's own
          height instead of a fixed w-24 — that used to crop the 16:9
          chapter cover into a near-square box. 3:2 rather than full 16:9:
          at 16:9 the cover took half the row on a phone and left too
          little room for the number/date/heart line. Desktop keeps its
          fixed-width column (sm:aspect-auto cancels the ratio there). */}
      <div className="relative aspect-3/2 sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-surface">
        {chapter.cover_image_url ? (
          <>
            <Image
              src={chapter.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 142px, 216px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-surface/20 to-surface" />
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 w-full pr-3 sm:pr-8">
        {/* The date truncates (min-w-0 + truncate) rather than overflowing
            — it used to spill across the gap into the heart on narrow
            phones, and the heart is shrink-0 so it always keeps its spot. */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-md sm:text-lg text-fg group-hover:text-fg-hover transition-colors duration-200 shrink-0">
              {formatChapterBadge(chapter.chapter_is_ex, displayNumber)}
            </span>
            <span className="min-w-0 truncate text-xs sm:text-sm text-fg-secondary">{publishedLabel}</span>
          </div>
          <div className="shrink-0">
            <ChapterFavoriteButton chapterId={chapter.id} initialFavorited={isFavorited} />
          </div>
        </div>
        <div className="text-sm mt-1 text-fg/90 truncate">{chapter.chapter_name}</div>
        <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted">
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