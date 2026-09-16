import Link from "next/link";
import { Search, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import RecentSearches from "@/component/search/RecentSearches";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const mangaList = query
    ? await prisma.manga.findMany({
        where: {
          OR: [
            { manga_title: { contains: query, mode: "insensitive" } },
            { author: { name: { contains: query, mode: "insensitive" } } },
            { chapters: { some: { chapter_name: { contains: query, mode: "insensitive" } } } },
          ],
        },
        orderBy: { updated_at: "desc" },
        include: {
          author: { select: { name: true } },
          // chapter_number is a 0-indexed sort key, not the number shown to
          // readers, and doesn't skip "ex" entries — computing the real
          // display number needs every chapter (see lib/chapter-number.ts)
          chapters: {
            select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
          },
        },
      })
    : [];

  return (
    <div
      className="relative min-h-screen bg-[#0a0a0a] px-6 sm:px-8 py-12"
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-2">
            Search
          </h1>
          <p className="text-sm text-[#b6b0a2]">Find manga by title, author, or chapter name.</p>
        </div>

        <form action="/search" method="GET" className="mb-10">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b655e]" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by title, author, or chapter…"
              autoFocus
              className="w-full bg-[#1b1a1c] border border-[#050505] rounded-md pl-10 pr-10 py-2.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#b6b0a2] transition-colors duration-200"
            />
            {/* Replaces the browser's own native "x" clear button (suppressed
                in globals.css) with one that matches the site's Lucide icon
                language. No client JS needed — the query is already known
                server-side, so this is just a link back to a bare /search. */}
            {query && (
              <Link
                href="/search"
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b655e] hover:text-[#ece6d8] transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </Link>
            )}
          </div>
        </form>

        <RecentSearches query={query} />

        {query === "" ? (
          <p className="text-[#b6b0a2] text-center mt-12 text-sm">
            Start typing to search for manga.
          </p>
        ) : mangaList.length === 0 ? (
          <p className="text-[#b6b0a2] text-center mt-12 text-sm">
            No manga found for &quot;{query}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {mangaList.map((manga) => {
              const latest = manga.chapters.slice().sort((a, b) => b.chapter_number - a.chapter_number)[0];
              const displayNumbers = getChapterDisplayNumbers(manga.chapters);
              return (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.manga_title}
                  author={manga.author.name ?? "Unknown"}
                  coverImageUrl={manga.cover_image_url}
                  latestChapterDisplayNumber={latest ? (displayNumbers.get(latest.id) ?? null) : null}
                  latestChapterIsEx={latest?.chapter_is_ex ?? false}
                  latestChapterName={latest?.chapter_name ?? null}
                  updatedAt={manga.updated_at}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
