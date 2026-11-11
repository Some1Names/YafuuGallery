"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import LocalDate from "@/component/LocalDate";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { pageCount, pageSlice, pagerItems } from "@/lib/mangadex/chapter-pages";
import { chapterBadge } from "@/lib/mangadex/map";
import type { MdChapter, MdLanguage } from "@/lib/mangadex/types";

// The chapter list on a MangaDex title page, made to look like the one
// on the site's own title pages (ChapterArcSection + ChapterRow): a
// "Chapters" heading with its count on a ruled line, an oldest/newest
// toggle on the right, and rows with a picture, "#012", date and name.
//
// Differences from the site's own rows, all because MangaDex has less to
// offer or the feature isn't built for it yet: the picture is the
// manga's cover (MangaDex has no per-chapter image), the last line names
// the scanlation group instead of like/comment counts, and there is no
// favorite heart or Arcs tab.
//
// The list is paged (lib/mangadex/chapter-pages.ts): long series have
// hundreds of chapters. All of them are already here — the page sends
// the whole list — so turning a page is instant and needs no request.

const LANGUAGE_NAMES: Record<MdLanguage, string> = { th: "ไทย", en: "English" };

export default function MdChapterSection({
  mangaId,
  chapters,
  coverUrl,
  language,
  languages,
}: {
  mangaId: string;
  // readable chapters of one language, oldest first
  chapters: MdChapter[];
  coverUrl: string | null;
  language: MdLanguage;
  // every language this title can be read in here
  languages: MdLanguage[];
}) {
  const t = useTranslations("Manga");
  const tBrowse = useTranslations("Browse");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const ordered = useMemo(() => (sortOrder === "asc" ? chapters : [...chapters].reverse()), [chapters, sortOrder]);
  const pages = pageCount(ordered.length);
  const rows = useMemo(() => pageSlice(ordered, page), [ordered, page]);

  // Going to another page brings the top of the list back into view —
  // otherwise the reader is left looking at the pager at the bottom of
  // a list that just changed above it.
  const topRef = useRef<HTMLDivElement>(null);
  function goTo(next: number) {
    setPage(Math.min(Math.max(next, 1), pages));
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  const pagerButton =
    "inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-md border text-sm tabular-nums transition-colors duration-200 ";

  return (
    <>
      {/* scroll-mt: clear of the sticky navbar when a page change scrolls here */}
      <div
        ref={topRef}
        className="flex items-end justify-between gap-4 mb-5 border-b border-fg/10 scroll-mt-20 md:scroll-mt-24"
      >
        <h2 className="relative pb-3 text-lg sm:text-xl text-fg font-(family-name:--font-display)">
          {t("chapters")}
          <span className="ml-2 align-middle text-xs font-(family-name:--font-body) font-medium">{chapters.length}</span>
          <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />
        </h2>

        <div className="flex items-center gap-4 pb-3">
          {/* Which translation to list — a link, since each language is
              its own set of chapters fetched by the page. */}
          {languages.length > 1 && (
            <nav aria-label={tBrowse("langLabel")} className="flex gap-3 text-xs">
              {languages.map((l) => (
                <Link
                  key={l}
                  href={`/browse/${mangaId}?lang=${l}`}
                  scroll={false}
                  aria-current={l === language ? "true" : undefined}
                  className={
                    "transition-colors duration-200 " +
                    (l === language
                      ? "text-fg font-semibold underline underline-offset-4"
                      : "text-fg-secondary hover:text-fg")
                  }
                >
                  {LANGUAGE_NAMES[l]}
                </Link>
              ))}
            </nav>
          )}

          <button
            type="button"
            onClick={() => {
              setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
              // the other end of the list starts from its first page
              setPage(1);
            }}
            aria-label={sortOrder === "asc" ? t("oldestFirst") : t("newestFirst")}
            className="flex items-center gap-1.5 text-xs text-fg-secondary hover:text-fg whitespace-nowrap transition-colors duration-200"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span className="sm:hidden">{sortOrder === "asc" ? t("oldest") : t("newest")}</span>
            <span className="hidden sm:inline">{sortOrder === "asc" ? t("oldestFirst") : t("newestFirst")}</span>
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-sm text-fg-secondary">{tBrowse("noChapters")}</p>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {rows.map((chapter) => {
            const badge = chapterBadge(chapter, tBrowse("oneshot"));
            const date = chapter.publishedAt ? <LocalDate date={chapter.publishedAt} /> : null;
            return (
              // "Stretched link", as in ChapterRow: the number is the <a>
              // and its ::after covers the row.
              <div
                key={chapter.id}
                className="relative h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-fg transition-colors duration-200"
              >
                <div className="relative aspect-square min-[360px]:aspect-4/3 sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-surface">
                  {coverUrl ? (
                    <>
                      {/* Plain <img>: a thumbnail from our own cached cover
                          route (see MdMangaCard). The same file for every
                          row, so the browser fetches it once. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-surface/20 to-surface" />
                    </>
                  ) : (
                    <NoImagePlaceholder />
                  )}
                </div>

                <div className="min-w-0 w-full pr-3 sm:pr-8">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <Link
                      href={`/read/${chapter.id}`}
                      aria-label={chapter.title ? `${badge} ${chapter.title}` : badge}
                      className="text-md sm:text-lg text-fg group-hover:text-fg-hover transition-colors duration-200 shrink-0 outline-none after:absolute after:inset-0"
                    >
                      {badge}
                    </Link>
                    <span className="hidden sm:inline min-w-0 truncate text-sm text-fg-secondary">{date}</span>
                  </div>
                  {chapter.title && (
                    <div className="text-sm mt-1 text-fg/90 line-clamp-2 sm:line-clamp-1 wrap-break-word">
                      {chapter.title}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted">
                    <span className="sm:hidden shrink-0">{date}</span>
                    {chapter.groups.length > 0 && <span className="truncate min-w-0">{chapter.groups.join(", ")}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label={tBrowse("pagerLabel")} className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label={tBrowse("pagePrev")}
            className={
              pagerButton +
              "border-border text-fg-secondary enabled:hover:text-fg enabled:hover:border-fg-secondary disabled:opacity-40 disabled:cursor-default"
            }
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          {pagerItems(page, pages).map((item, i) =>
            item === "gap" ? (
              <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-fg-muted">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                aria-label={tBrowse("pageN", { n: item })}
                aria-current={item === page ? "page" : undefined}
                className={
                  pagerButton +
                  (item === page
                    ? "border-fg bg-fg text-bg font-semibold"
                    : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
                }
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === pages}
            aria-label={tBrowse("pageNext")}
            className={
              pagerButton +
              "border-border text-fg-secondary enabled:hover:text-fg enabled:hover:border-fg-secondary disabled:opacity-40 disabled:cursor-default"
            }
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </>
  );
}
