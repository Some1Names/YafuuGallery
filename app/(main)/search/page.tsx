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
import ShowMoreLink from "@/component/ShowMoreLink";

const RESULTS_PAGE_SIZE = 20;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string | string[] }>;
}) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const isSearching = query !== "";
  const pageCount = parsePageCount(page);
  const resultsLimit = pageCount * RESULTS_PAGE_SIZE;

  // No query = browse everything (newest first), so the page is never a
  // dead end and doubles as the site's "all manga" listing.
  const where: Prisma.MangaWhereInput | undefined = isSearching
    ? {
        OR: [
          { manga_title: { contains: query, mode: "insensitive" } },
          { author: { name: { contains: query, mode: "insensitive" } } },
          { chapters: { some: { chapter_name: { contains: query, mode: "insensitive" } } } },
        ],
      }
    : undefined;

  const [resultRows, totalCount] = await Promise.all([
    prisma.manga.findMany({
      where,
      // one extra row just to learn whether "Show more" is needed
      take: resultsLimit + 1,
      orderBy: { updated_at: "desc" },
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

  const showMoreHref = `/search?${new URLSearchParams({
    ...(isSearching && { q: query }),
    page: String(pageCount + 1),
  })}`;

  const needle = query.toLowerCase();

  const grid = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {mangaList.map((manga) => {
        // chapters are ordered by chapter_number asc, so the last is latest
        const latest = manga.chapters[manga.chapters.length - 1];
        const displayNumbers = getChapterDisplayNumbers(manga.chapters);
        const authorName = manga.author.name ?? "Unknown";

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
                className="mt-1.5 text-sm text-fg-secondary hover:text-fg truncate transition-colors duration-200"
              >
                Matches{" "}
                <span className="text-fg">
                  {formatChapterBadge(firstMatch.chapter_is_ex, displayNumbers.get(firstMatch.id))}{" "}
                  {firstMatch.chapter_name}
                </span>
                {chapterMatches.length > 1 && ` and ${chapterMatches.length - 1} more`}
              </Link>
            )}
          </div>
        );
      })}
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
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">
            Search
          </h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">Find manga by title, author, or chapter name.</p>
        </div>

        <SearchInput initialQuery={query} />

        <RecentSearches query={query} />

        {isSearching ? (
          totalCount === 0 ? (
            <p className="text-fg-secondary text-center mt-12 text-sm">
              No manga found for &quot;{query}&quot;.
            </p>
          ) : (
            <>
              <p className="text-sm text-fg-secondary mb-5">
                {totalCount} {totalCount === 1 ? "result" : "results"} for{" "}
                <span className="text-fg">&ldquo;{query}&rdquo;</span>
              </p>
              <SearchResultsRecorder query={query}>{grid}</SearchResultsRecorder>
            </>
          )
        ) : totalCount === 0 ? (
          <p className="text-fg-secondary text-center mt-12 text-sm">No manga published yet.</p>
        ) : (
          <>
            <h2 className="text-xl text-fg mb-5 font-(family-name:--font-display)">
              All manga
              <span className="ml-2 align-middle text-xs text-fg-muted font-(family-name:--font-body) font-medium">
                {totalCount}
              </span>
            </h2>
            {grid}
          </>
        )}

        {hasMore && <ShowMoreLink href={showMoreHref} />}
      </div>
    </div>
  );
}
