import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const mangaList = query
    ? await prisma.manga.findMany({
        where: { manga_title: { contains: query, mode: "insensitive" } },
        orderBy: { updated_at: "desc" },
        include: {
          author: { select: { name: true } },
          chapters: {
            orderBy: { chapter_number: "desc" },
            take: 1,
            select: { chapter_number: true, chapter_name: true },
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
          <p className="text-sm text-[#b6b0a2]">Find manga by title.</p>
        </div>

        <form action="/search" method="GET" className="mb-10">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b655e]" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search manga titles…"
              autoFocus
              className="w-full bg-[#1b1a1c] border border-[#050505] rounded-md pl-10 pr-4 py-2.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#b6b0a2] transition-colors duration-200"
            />
          </div>
        </form>

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
              const latest = manga.chapters[0];
              return (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.manga_title}
                  author={manga.author.name ?? "Unknown"}
                  coverImageUrl={manga.cover_image_url}
                  latestChapterNumber={latest?.chapter_number ?? null}
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
