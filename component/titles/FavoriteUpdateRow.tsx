import Link from "next/link";
import Image from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";
import { timeAgo } from "@/lib/time-ago";
import type { FavoriteUpdateItem } from "@/lib/favorite-updates";

// One line of the Favorites → Updates feed: the manga's cover, which
// manga, which chapter, and when it went up. Unread new chapters get the
// same red as MangaCard's fresh-update badge, plus a "New" label (color
// alone isn't enough to tell them apart).
export default function FavoriteUpdateRow({ item }: { item: FavoriteUpdateItem }) {
  return (
    <Link
      href={`/viewer/${item.chapterId}`}
      className="group flex items-center gap-4 p-3 rounded-md border border-border bg-surface/60 hover:bg-surface hover:border-fg-secondary/60 transition-colors duration-200"
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
          <span className="shrink-0 text-fg font-(family-name:--font-display)">
            {formatChapterBadge(item.chapterIsEx, item.displayNumber)}
          </span>
          <span
            className={
              "truncate text-sm sm:text-base " + (item.isNew ? "text-fg font-medium" : "text-fg-secondary")
            }
          >
            {item.chapterName}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1">
        {item.isNew && (
          <span className="px-1.5 py-0.5 rounded-sm bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase">
            New
          </span>
        )}
        <span className="text-xs text-fg-muted whitespace-nowrap">{timeAgo(item.uploadedAt)}</span>
      </div>
    </Link>
  );
}
