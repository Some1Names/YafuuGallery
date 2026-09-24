import Link from "next/link";
import Image from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import RemoveFromHistoryButton from "./RemoveFromHistoryButton";
import { formatChapterBadge } from "@/lib/chapter-number";
import { timeAgo } from "@/lib/time-ago";
import type { ReadingHistoryItem } from "@/lib/reading-history";

function progressLabel(item: ReadingHistoryItem): string {
  if (item.completed) return "Finished";
  if (item.lastPage > 1) return `Stopped on page ${item.lastPage}`;
  return "Opened";
}

// One /history entry. Same row look as Favorites → Updates. The remove
// button is a sibling positioned over the row's right edge, not inside the
// link (a button inside an <a> is invalid HTML — see MangaCard).
export default function HistoryRow({ item }: { item: ReadingHistoryItem }) {
  const badge = formatChapterBadge(item.chapterIsEx, item.displayNumber);
  return (
    <div className="relative">
      <Link
        href={`/viewer/${item.chapterId}`}
        className="flex items-center gap-4 p-3 pr-14 rounded-md border border-border bg-surface/60 hover:bg-surface hover:border-fg-secondary/60 transition-colors duration-200"
      >
        <div className="relative w-12 sm:w-14 aspect-2/3 shrink-0 rounded overflow-hidden bg-bg">
          {item.mangaCoverUrl ? (
            <Image src={item.mangaCoverUrl} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <NoImagePlaceholder />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs sm:text-sm text-fg-secondary truncate">{item.mangaTitle}</div>
          <div className="mt-0.5 flex items-baseline gap-2 min-w-0">
            <span className="shrink-0 text-fg font-(family-name:--font-display)">{badge}</span>
            <span className="truncate text-sm sm:text-base text-fg">{item.chapterName}</span>
          </div>
          <div className="mt-0.5 text-xs text-fg-muted">
            <span className={item.completed ? "text-fg-secondary" : undefined}>{progressLabel(item)}</span>
            {" · "}
            {timeAgo(item.readAt)}
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <RemoveFromHistoryButton chapterId={item.chapterId} label={`${item.mangaTitle} ${badge}`} />
      </div>
    </div>
  );
}
