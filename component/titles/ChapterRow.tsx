import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import ChapterFavoriteButton from "./ChapterFavoriteButton";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";
import { formatPublishedDate } from "@/lib/dates";
import type { ChapterItem } from "./types";

interface ChapterRowProps {
  chapter: ChapterItem;
  displayNumber: number;
  isFavorited?: boolean;
}

export default function ChapterRow({ chapter, displayNumber, isFavorited = false }: ChapterRowProps) {
  const publishedLabel = formatPublishedDate(chapter.published_date);

  const badge = formatChapterBadge(chapter.chapter_is_ex, displayNumber);

  // "Stretched link": the chapter number is the actual <a>, and its
  // ::after covers the whole row, so the entire row is still one big click
  // target — while the favorite heart sits above that overlay (relative
  // z-10) as a real sibling button. Wrapping the whole row in the <a> put
  // the button inside the link, which is invalid HTML. The row shows the
  // keyboard focus ring for the link via has-[:focus-visible].
  return (
    <div
      className="relative h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-fg transition-colors duration-200"
    >
      {/* Mobile: width is driven by an aspect ratio off the row's own
          height. 4:3 (square below 360px) rather than the cover's own
          16:9: wider, the picture took over half the row on a phone and
          cut the name and date to a few letters. Desktop keeps its
          fixed-width column (sm:aspect-auto cancels the ratio there). */}
      <div className="relative aspect-square min-[360px]:aspect-4/3 sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-surface">
        {chapter.cover_image_url ? (
          <>
            <Image
              src={chapter.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 128px, 216px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-surface/20 to-surface" />
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 w-full pr-3 sm:pr-8">
        {/* Phones: the date sits with the like/comment counts below, so
            this line is just the number and the heart, and the name gets
            two lines. From sm up it's beside the number, truncating
            rather than running into the heart. */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-baseline gap-2 min-w-0">
            <Link
              href={`/viewer/${chapter.id}`}
              aria-label={`${badge} ${chapter.chapter_name}`}
              className="text-md sm:text-lg text-fg group-hover:text-fg-hover transition-colors duration-200 shrink-0 outline-none after:absolute after:inset-0"
            >
              {badge}
            </Link>
            <span className="hidden sm:inline min-w-0 truncate text-sm text-fg-secondary">{publishedLabel}</span>
          </div>
          <div className="relative z-10 shrink-0">
            <ChapterFavoriteButton chapterId={chapter.id} initialFavorited={isFavorited} />
          </div>
        </div>
        <div className="text-sm mt-1 text-fg/90 line-clamp-2 sm:line-clamp-1 wrap-break-word">{chapter.chapter_name}</div>
        <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted">
          <span className="sm:hidden truncate min-w-0">{publishedLabel}</span>
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
    </div>
  );
}