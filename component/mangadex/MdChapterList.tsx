import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import LocalDate from "@/component/LocalDate";
import { chapterLabel, isReadable } from "@/lib/mangadex/map";
import type { MdChapter } from "@/lib/mangadex/types";

// The chapter rows on a MangaDex title page, in the order given (the
// page passes newest first). Three kinds of chapter:
//   - hosted on MangaDex  -> opens our reader
//   - on an official site -> opens that site in a new tab (there are no
//     page images to show; MangaPlus chapters are all like this)
//   - neither             -> not listed, nothing to open
// When several groups uploaded the same chapter, each upload is its own
// row with its group named.
export default function MdChapterList({ chapters, emptyText }: { chapters: MdChapter[]; emptyText: string }) {
  const t = useTranslations("Browse");
  const words = { chapter: (n: string) => t("chapterNumber", { n }), oneshot: t("oneshot") };
  const rows = chapters.filter((c) => isReadable(c) || c.externalUrl);

  if (rows.length === 0) {
    return <p className="py-8 text-sm text-fg-secondary">{emptyText}</p>;
  }

  const rowClass =
    "group flex items-center justify-between gap-4 px-4 py-3 bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg transition-colors duration-200";

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((chapter) => {
        const label = chapterLabel(chapter, words);
        const body = (
          <>
            <span className="min-w-0">
              <span className="block text-fg line-clamp-2 wrap-break-word">{label}</span>
              <span className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-fg-muted">
                {chapter.groups.length > 0 && <span className="wrap-anywhere">{chapter.groups.join(", ")}</span>}
                {chapter.publishedAt && <LocalDate date={chapter.publishedAt} />}
              </span>
            </span>
            {chapter.externalUrl && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border text-xs text-fg-secondary">
                {t("officialSite")}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </span>
            )}
          </>
        );

        return (
          <li key={chapter.id}>
            {chapter.externalUrl ? (
              <a href={chapter.externalUrl} target="_blank" rel="noopener noreferrer" className={rowClass}>
                {body}
              </a>
            ) : (
              <Link href={`/read/${chapter.id}`} className={rowClass}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
