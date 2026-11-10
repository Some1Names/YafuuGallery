import { cache, type ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ShowMoreLink from "@/component/ShowMoreLink";
import MdMangaCard from "@/component/mangadex/MdMangaCard";
import type { GenreSlug, MangaStatusValue } from "@/lib/genres";
import { earlierPage, pagesToFetch } from "@/lib/mangadex/browse-params";
import { listManga, type MdLanguageFilter } from "@/lib/mangadex/queries";
import type { MdLanguage, MdMangaSummary } from "@/lib/mangadex/types";
import type { SortValue } from "@/lib/search-filters";

// The MangaDex half of /search. The site's own manga are rendered by the
// page straight away; everything here sits behind <Suspense>, so a slow
// or unreachable MangaDex never holds the page up or breaks it.

export interface MdSearchArgs {
  q: string;
  genre: GenreSlug | null;
  status: MangaStatusValue | null;
  sort: SortValue;
  lang: MdLanguageFilter;
  // how many "Show more" pages are on screen (the page's ?page=)
  pageCount: number;
  locale: MdLanguage;
}

type MdSearchResult = { ok: true; items: MdMangaSummary[]; total: number; hasMore: boolean } | { ok: false };

// cache(): the results heading and the grid both need this within one
// render — they share one set of requests. Plain arguments (not an
// object) because cache() matches calls by argument identity.
const load = cache(
  async (
    q: string,
    genre: GenreSlug | null,
    status: MangaStatusValue | null,
    sort: SortValue,
    lang: MdLanguageFilter,
    pageCount: number,
    locale: MdLanguage,
  ): Promise<MdSearchResult> => {
    try {
      const pages = await Promise.all(
        pagesToFetch(pageCount).map((page) => listManga({ q, genre, status, sort, lang, page, locale })),
      );
      // a title can shift between pages while they load; keep the first
      const seen = new Set<string>();
      const items = pages.flatMap((p) => p.items).filter((m) => !seen.has(m.id) && seen.add(m.id));
      const last = pages[pages.length - 1];
      return { ok: true, items, total: last.total, hasMore: last.hasMore };
    } catch (err) {
      // MangaDex down, rate-limiting us, timed out: the page carries on
      // with the site's own manga.
      console.error("[search] MangaDex results unavailable:", err);
      return { ok: false };
    }
  },
);

const loadFor = (a: MdSearchArgs) => load(a.q, a.genre, a.status, a.sort, a.lang, a.pageCount, a.locale);

// Renders its children with how many titles MangaDex has for these
// filters (0 if it couldn't be asked) — for the results heading's count.
export async function WithMdTotal({ args, children }: { args: MdSearchArgs; children: (total: number) => ReactNode }) {
  const result = await loadFor(args);
  return children(result.ok ? result.total : 0);
}

// The MangaDex cards, as items of the page's own grid (after the site's
// manga), followed by whatever closes the grid: a note if MangaDex
// couldn't be reached, the "nothing found" message if both sources came
// up empty, and "Show more".
export async function MdSearchResults({
  args,
  ownCount,
  ownHasMore,
  showMoreHref,
  earlierHref,
  emptyMessage,
}: {
  args: MdSearchArgs;
  // the site's own manga for the same filters
  ownCount: number;
  ownHasMore: boolean;
  showMoreHref: string;
  // builds the link back to MangaDex results no longer in the grid
  earlierHref: (page: number) => string;
  emptyMessage: ReactNode;
}) {
  const [result, t] = await Promise.all([loadFor(args), getTranslations("Browse")]);
  const items = result.ok ? result.items : [];
  const earlier = result.ok ? earlierPage(args.pageCount) : null;
  const hasMore = ownHasMore || (result.ok && result.hasMore);

  return (
    <>
      {earlier !== null && items.length > 0 && (
        <p className="col-span-full text-sm">
          <Link href={earlierHref(earlier)} className="text-fg underline underline-offset-2 hover:no-underline">
            {t("earlier")}
          </Link>
        </p>
      )}

      {items.map((manga) => (
        <MdMangaCard key={manga.id} manga={manga} />
      ))}

      {ownCount === 0 && items.length === 0 && <div className="col-span-full">{emptyMessage}</div>}

      {!result.ok && <p className="col-span-full text-center text-sm text-fg-muted">{t("unavailable")}</p>}

      {hasMore && (
        <div className="col-span-full">
          <ShowMoreLink href={showMoreHref} />
        </div>
      )}
    </>
  );
}

// What sits in the grid while MangaDex is being asked: a row of blank
// cards, and "Show more" already if the site's own list has more.
export function MdSearchFallback({ ownHasMore, showMoreHref }: { ownHasMore: boolean; showMoreHref: string }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} aria-hidden="true" className="flex flex-col gap-2">
          <div className="w-full aspect-2/3 rounded-lg bg-surface animate-pulse" />
          <div className="h-5 w-3/4 rounded-sm bg-surface animate-pulse" />
        </div>
      ))}
      {ownHasMore && (
        <div className="col-span-full">
          <ShowMoreLink href={showMoreHref} />
        </div>
      )}
    </>
  );
}
