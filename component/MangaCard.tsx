import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import MangaFavoriteButton from "./titles/MangaFavoriteButton";
import NoImagePlaceholder from "./NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";
import { isOlderThan, timeAgo } from "@/lib/time-ago";

interface MangaCardProps {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  // null exactly when the manga has no chapters at all — otherwise this is
  // the manga's highest chapter_number entry, which formatChapterBadge
  // turns into "#001" (or "ex", if that entry happens to be one)
  latestChapterDisplayNumber: number | null;
  latestChapterIsEx: boolean;
  latestChapterName: string | null;
  updatedAt: Date;
  // omit entirely to hide the heart badge — only pages that already know
  // the viewer's favorite state (e.g. the favorites page) should pass this
  isFavorited?: boolean;
  // Unread chapters uploaded since the reader last caught up (favorites
  // page only — see lib/favorite-updates.ts). 0/omitted shows nothing.
  newChapterCount?: number;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function MangaCard({
  id,
  title,
  author,
  coverImageUrl,
  latestChapterDisplayNumber,
  latestChapterIsEx,
  latestChapterName,
  updatedAt,
  isFavorited,
  newChapterCount = 0,
}: MangaCardProps) {
  // A server component, rendered once per request — reading the clock
  // here (as timeAgo below does too) can't cause a re-render mismatch.
  const isStale = isOlderThan(updatedAt, WEEK_MS);

  // The favorite toggle is a SIBLING of the card's link, positioned over
  // the cover's corner — not inside the <a>. A button inside a link is
  // invalid HTML (interactive content can't nest), and screen readers
  // announce the pair confusingly; the old version only worked because the
  // button swallowed the click with preventDefault.
  return (
    <div className="group relative">
      <Link href={`/manga/titles/${id}`} className="flex flex-col gap-2 cursor-pointer">
        {/* Cover */}
        <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]">
          {/* Cover Image */}
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              // Matches the home/search/favorites grid this renders in:
              // grid-cols-2 sm:grid-cols-3 md:grid-cols-5, so the browser
              // knows roughly how wide a card actually is at each breakpoint
              // instead of downloading a full-width image for a ~20vw card.
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <NoImagePlaceholder />
          )}
  
          {/* Last Updated — red corner tab for updates within the last week,
              translucent dark gray once stale. red-600 rather than red-500 so
              the white text clears 4.5:1 contrast. Fixed colors, not theme
              tokens: it sits on cover art, not on the page background. */}
          <div
            className={
              "absolute top-0 left-0 flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 text-white text-xs sm:text-sm font-semibold tracking-tight rounded-br-lg shadow-md " +
              (isStale ? "bg-neutral-800/80 backdrop-blur-sm" : "bg-red-600")
            }
          >
            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
            {timeAgo(updatedAt)}
          </div>
  
          {newChapterCount > 0 && (
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-sm bg-red-600 text-white text-xs font-bold tracking-wide shadow-md">
              {newChapterCount} NEW
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col gap-5 px-6 py-15 bg-bg/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-col">
              <div className="text-fg font-bold text-xl line-clamp-1">{title}</div>
              <div className="text-fg-secondary text-base">{author}</div>
            </div>
  
            {latestChapterName !== null && (
              <div className="flex flex-col">
                <div className="self-start px-2 py-1 bg-fg text-bg text-sm font-bold rounded-sm">
                  {formatChapterBadge(latestChapterIsEx, latestChapterDisplayNumber ?? undefined)}
                </div>
                <div className="text-fg-secondary text-lg">{latestChapterName}</div>
              </div>
            )}
          </div>
        </div>
  
        {/* Base Info */}
        <div className="flex flex-col">
          <div className="font-bold text-xl line-clamp-2">{title}</div>
          <div className="text-gray-500 text-base">
            {latestChapterName !== null
              ? formatChapterBadge(latestChapterIsEx, latestChapterDisplayNumber ?? undefined)
              : "No chapters yet"}
          </div>
        </div>
      </Link>

      {/* Favorite toggle — after the link in the DOM (and z-10) so it sits
          above the cover's hover overlay and stays clickable. top-2 right-2
          of this wrapper = the cover's top-right corner, since the cover is
          the first thing in the card. */}
      {isFavorited !== undefined && (
        <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-bg/60 backdrop-blur-sm flex items-center justify-center">
          <MangaFavoriteButton mangaId={id} initialFavorited={isFavorited} variant="icon" />
        </div>
      )}
    </div>
  );
}