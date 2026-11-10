import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import RecentSearches from "@/component/search/RecentSearches";
import SearchInput from "@/component/search/SearchInput";
import SearchResultsRecorder from "@/component/search/SearchResultsRecorder";
import { formatChapterBadge, getChapterDisplayNumbers } from "@/lib/chapter-number";
import { parsePageCount, splitExtraRow } from "@/lib/pagination";
import SearchFilterBar from "@/component/search/SearchFilterBar";
import SortDropdown from "@/component/search/SortDropdown";
import { parseSearchFilters, searchHref, type SortValue } from "@/lib/search-filters";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { MdSearchFallback, MdSearchResults, WithMdTotal, type MdSearchArgs } from "@/component/mangadex/MdSearchResults";
import { toMdLanguage } from "@/lib/mangadex/browse-params";

const RESULTS_PAGE_SIZE = 20;

// updated_at/title tie-breakers keep the order stable between "Show more"
// pages when the main key is equal (e.g. several manga with 0 views).
const ORDER_BY: Record<SortValue, Prisma.MangaOrderByWithRelationInput[]> = {
  updated: [{ updated_at: "desc" }],
  new: [{ created_at: "desc" }],
  views: [{ view_count: "desc" }, { updated_at: "desc" }],
  title: [{ manga_title: "asc" }, { created_at: "asc" }],
};

// The tab/history title says what's on the page: the search term, else
// the genre being browsed, else just "Search".
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { q, genre } = parseSearchFilters(await searchParams);
  const t = await getTranslations("Search");
  const tGenre = await getTranslations("Genres");
  if (q) return { title: t("metaQuery", { query: q }) };
  if (genre) return { title: t("metaGenre", { genre: tGenre(genre) }) };
  return { title: t("title") };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const t = await getTranslations("Search");
  const tGenre = await getTranslations("Genres");
  const { q: query, genre, status, sort } = filters;
  // MangaDex titles are listed in the same grid, after the site's own
  // (component/mangadex/MdSearchResults). Their chapter language is the
  // one filter the site's manga don't have: ?lang=, else the interface
  // language.
  const locale = toMdLanguage(await getLocale());
  const mdLang = filters.lang ?? locale;
  const filtersOnly = { genre, status, sort, lang: filters.lang };
  const page = params.page;
  const isSearching = query !== "";
  const isFiltered = genre !== null || status !== null;
  const pageCount = parsePageCount(page);
  const resultsLimit = pageCount * RESULTS_PAGE_SIZE;

  // No query = browse everything, so the page is never a dead end and
  // doubles as the site's "all manga" listing. Genre/status narrow either.
  const where: Prisma.MangaWhereInput = {
    AND: [
      isSearching
        ? {
            OR: [
              { manga_title: { contains: query, mode: "insensitive" } },
              { author: { name: { contains: query, mode: "insensitive" } } },
              { chapters: { some: { chapter_name: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {},
      genre ? { genres: { has: genre } } : {},
      status ? { manga_status: status } : {},
    ],
  };

  const [resultRows, totalCount] = await Promise.all([
    prisma.manga.findMany({
      where,
      // one extra row just to learn whether "Show more" is needed
      take: resultsLimit + 1,
      orderBy: ORDER_BY[sort],
      include: {
        author: { select: { name: true } },
        // chapter_number is a 0-indexed sort key, not the number shown to
        // readers, and doesn't skip "ex" entries — computing the real
        // display number needs every chapter (see lib/chapter-number.ts).
        // Also what the "Matches #001 Veil" line below searches through.
        chapters: {
          orderBy: { chapter_number: "asc" },
          select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
        },
      },
    }),
    prisma.manga.count({ where }),
  ]);
  const { items: mangaList, hasMore } = splitExtraRow(resultRows, resultsLimit);
  const mdArgs: MdSearchArgs = { q: query, genre, status, sort, lang: mdLang, pageCount, locale };

  const showMoreHref = searchHref(filters, pageCount + 1);
  const clearFiltersHref = searchHref({ q: query, sort });
  const clearFiltersLink = (
    <Link href={clearFiltersHref} scroll={false} className="text-fg underline underline-offset-2 hover:no-underline">
      {t("clearFilters")}
    </Link>
  );

  const needle = query.toLowerCase();

  // Phones: the sort button sits at the end of the results heading line
  // (the filter bar has no room for it beside the status pill there).
  const phoneSort = (
    <div className="sm:hidden shrink-0">
      <SortDropdown filters={filters} />
    </div>
  );

  // Shown in the grid's place when neither the site nor MangaDex has
  // anything for these filters.
  const emptyMessage = (
    <p className="text-fg-secondary text-center mt-12 text-sm">
      {isSearching ? (
        isFiltered ? (
          <>
            {t("noResultsFiltered", { query })} {clearFiltersLink}
          </>
        ) : (
          t("noResults", { query })
        )
      ) : isFiltered ? (
        <>
          {t("noMatchFilters")} {clearFiltersLink}
        </>
      ) : (
        t("noneYet")
      )}
    </p>
  );

  // The line above the grid, for a given number of results. Nothing at
  // zero: the grid shows the nothing-found message instead.
  const heading = (count: number) =>
    count === 0 ? null : isSearching ? (
      <p className="min-w-0 text-sm text-fg-secondary wrap-anywhere">
        {t.rich("resultsFor", {
          count,
          query,
          q: (chunks) => <span className="text-fg">{chunks}</span>,
        })}
      </p>
    ) : (
      <h2 className="min-w-0 text-xl text-fg font-(family-name:--font-display)">
        {genre ? tGenre(genre) : t("allManga")}
        <span className="ml-2 align-middle text-xs text-fg-muted font-(family-name:--font-body) font-medium">
          {count.toLocaleString()}
        </span>
      </h2>
    );

  const grid = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {mangaList.map((manga) => {
        // chapters are ordered by chapter_number asc, so the last is latest
        const latest = manga.chapters[manga.chapters.length - 1];
        const displayNumbers = getChapterDisplayNumbers(manga.chapters);
        const authorName = manga.author.name ?? t("unknownAuthor");

        // A manga can match on a chapter name alone, and then nothing on
        // its card says why it showed up (the card shows its LATEST
        // chapter). Name the matching chapter and link straight to it —
        // only when the title/author didn't already match on their own.
        const matchedOnCard =
          manga.manga_title.toLowerCase().includes(needle) || authorName.toLowerCase().includes(needle);
        const chapterMatches =
          isSearching && !matchedOnCard
            ? manga.chapters.filter((c) => c.chapter_name.toLowerCase().includes(needle))
            : [];
        const firstMatch = chapterMatches[0];

        return (
          <div key={manga.id} className="flex flex-col min-w-0">
            <MangaCard
              id={manga.id}
              title={manga.manga_title}
              author={authorName}
              coverImageUrl={manga.cover_image_url}
              latestChapterDisplayNumber={latest ? (displayNumbers.get(latest.id) ?? null) : null}
              latestChapterIsEx={latest?.chapter_is_ex ?? false}
              latestChapterName={latest?.chapter_name ?? null}
              updatedAt={manga.updated_at}
            />
            {firstMatch && (
              <Link
                href={`/viewer/${firstMatch.id}`}
                className="mt-1.5 text-sm text-fg-secondary hover:text-fg line-clamp-2 wrap-break-word transition-colors duration-200"
              >
                {t("matches")}{" "}
                <span className="text-fg">
                  {formatChapterBadge(firstMatch.chapter_is_ex, displayNumbers.get(firstMatch.id))}{" "}
                  {firstMatch.chapter_name}
                </span>
                {chapterMatches.length > 1 && t("andMore", { count: chapterMatches.length - 1 })}
              </Link>
            )}
          </div>
        );
      })}

      {/* MangaDex titles for the same filters, streamed in after the
          site's own. This also renders what closes the grid: "Show
          more", and the nothing-found message when both are empty. */}
      <Suspense
        // a new search or filter shows the blank cards again instead of
        // leaving the previous results up
        key={searchHref(filters, pageCount) + mdLang}
        fallback={<MdSearchFallback ownHasMore={hasMore} showMoreHref={showMoreHref} />}
      >
        <MdSearchResults
          args={mdArgs}
          ownCount={totalCount}
          ownHasMore={hasMore}
          showMoreHref={showMoreHref}
          earlierHref={(page) => searchHref(filters, page)}
          emptyMessage={emptyMessage}
        />
      </Suspense>
    </div>
  );

  return (
    <div
      className="relative min-h-screen bg-bg px-6 sm:px-8 py-12"
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">{t("subtitle")}</p>
        </div>

        <SearchInput initialQuery={query} filters={filtersOnly} />

        <RecentSearches query={query} filters={filtersOnly} />

        <SearchFilterBar filters={filters} mdLang={mdLang} />

        <div className="flex items-center justify-between gap-3 mb-5 min-h-7">
          {/* The count covers both sources, so it waits for MangaDex's
              total; until then it shows the site's own. */}
          <Suspense key={searchHref(filters) + mdLang} fallback={heading(totalCount)}>
            <WithMdTotal args={mdArgs}>{(mdTotal) => heading(totalCount + mdTotal)}</WithMdTotal>
          </Suspense>
          {phoneSort}
        </div>

        {isSearching ? <SearchResultsRecorder query={query}>{grid}</SearchResultsRecorder> : grid}
      </div>
    </div>
  );
}
