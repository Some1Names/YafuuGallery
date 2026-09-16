import Link from "next/link";
import { Clock } from "lucide-react";
import MangaFavoriteButton from "./titles/MangaFavoriteButton";
import NoImagePlaceholder from "./NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";

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
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let value = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [amount, u] of units) {
    if (Math.abs(value) < amount) {
      unit = u;
      break;
    }
    value /= amount;
  }

  return rtf.format(-Math.round(value), unit);
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
}: MangaCardProps) {
  const isStale = Date.now() - updatedAt.getTime() > WEEK_MS;

  return (
    <Link href={`/manga/titles/${id}`} className="group flex flex-col gap-2 cursor-pointer">
      {/* Cover */}
      <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]">
        {/* Cover Image */}
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder />
        )}

        {/* Last Updated */}
        <div
          className={
            "absolute top-0 left-0 flex items-center gap-1.5 px-3 py-2 text-white text-sm font-bold rounded-br-xl " +
            (isStale ? "bg-gray-500" : "bg-red-500")
          }
        >
          <Clock className="w-4 h-4" />
          {timeAgo(updatedAt)}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col gap-5 px-6 py-15 bg-[#0a0a0a]/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col">
            <div className="text-[#ece6d8] font-bold text-xl line-clamp-1">{title}</div>
            <div className="text-[#b6b0a2] text-base">{author}</div>
          </div>

          {latestChapterName !== null && (
            <div className="flex flex-col">
              <div className="self-start px-2 py-1 bg-[#ece6d8] text-[#0a0a0a] text-sm font-bold rounded-sm">
                {formatChapterBadge(latestChapterIsEx, latestChapterDisplayNumber ?? undefined)}
              </div>
              <div className="text-[#b6b0a2] text-lg">{latestChapterName}</div>
            </div>
          )}
        </div>

        {/* Favorite toggle — rendered after the hover overlay so it stays
            on top and clickable even while hovering the card */}
        {isFavorited !== undefined && (
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#0a0a0a]/60 backdrop-blur-sm flex items-center justify-center">
            <MangaFavoriteButton mangaId={id} initialFavorited={isFavorited} variant="icon" />
          </div>
        )}
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
  );
}