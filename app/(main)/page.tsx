import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";

export default async function BrowsePage() {
  const mangaList = await prisma.manga.findMany({
    orderBy: { updated_at: "desc" },
    include: {
      author: { select: { name: true } },
      // one query per manga would be slow; grab just the latest chapter
      // for each via a nested take:1 ordered by chapter_number desc
      chapters: {
        orderBy: { chapter_number: "desc" },
        take: 1,
        select: { chapter_number: true, chapter_name: true },
      },
    },
  });

  // No real "featured" flag exists in the schema yet — approximating with
  // whichever manga has the most total chapter views across all its
  // chapters. Swap this for a real Manga.is_featured boolean once you want
  // an author/admin to pick this manually instead.
  const viewStats = await prisma.chapter.groupBy({
    by: ["manga_id"],
    _sum: { view_count: true },
    orderBy: { _sum: { view_count: "desc" } },
    take: 1,
  });

  const featuredMangaId = viewStats[0]?.manga_id ?? mangaList[0]?.id ?? null;

  const featured = featuredMangaId
    ? await prisma.manga.findUnique({
      where: { id: featuredMangaId },
      include: {
        chapters: { orderBy: { chapter_number: "asc" }, take: 1, select: { id: true } },
      },
    })
    : null;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* Hero */}
      <section className="relative min-h-100 sm:min-h-125 md:min-h-150 pt-0 sm:pt-24 md:pt-28">
        {/* background image hidden on phone — the featured box itself
            becomes the hero there, edge to edge, no separate backdrop */}
        <div
          className="hidden sm:block absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/mangabg.png')`,
          }}
        />

        <div className="hidden sm:block absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

        {featured && (
          <div
            className="relative max-w-350 mx-auto px-6 md:px-8 py-14 md:py-20 rounded-none sm:rounded-lg shadow-none sm:shadow-lg bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage: `url('${featured.banner_image_url ?? "/wide.png"}')`,
            }}
          >
            {/* Scrim: guarantees text/button contrast no matter how bright
                the banner image is — a light banner would otherwise wash
                out the white text and the white "Start Reading" button */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent" />

            <div className="relative z-10 flex flex-col gap-2 items-start px-6 md:px-10">
              <div className="flex flex-col gap-2 items-start">
                <p className="text-[#b6b0a2] font-mono text-xs sm:text-sm">FEATURED MANGA</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white max-w-xl">
                  {featured.manga_title}
                </h1>
              </div>

              <p className="text-[#b6b0a2] text-sm sm:text-base max-w-lg mt-4 sm:mt-6 line-clamp-3">
                {featured.manga_synopsis}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
                {featured.chapters[0] ? (
                  <Link
                    href={`/manga/titles/${featured.id}/chapter/${featured.chapters[0].id}`}
                    className="bg-white text-black text-center px-6 py-3 rounded-md shadow-md hover:bg-white/85 transition-colors duration-200"
                  >
                    Start Reading
                  </Link>
                ) : (
                  <span className="bg-white/40 text-black/60 text-center px-6 py-3 rounded-md shadow-md cursor-not-allowed">
                    No chapters yet
                  </span>
                )}

                <Link
                  href={`/manga/titles/${featured.id}`}
                  className="bg-black/20 border border-white/40 text-white text-center px-6 py-3 rounded-md backdrop-blur-sm hover:bg-black/35 transition-colors duration-200"
                >
                  View Manga
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Latest Updates */}
      <section className="px-6 md:px-8 pt-8 pb-16 sm:pb-20 md:pb-28">
        <div className="max-w-350 mx-auto">

          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-[#b6b0a2] font-mono text-xs sm:text-sm">
                RECENTLY UPDATED
              </p>

              <h2 className="text-2xl sm:text-3xl text-white font-bold">
                Latest Manga
              </h2>
            </div>

            {/* "View All" has nowhere else to go yet — this page already
                lists every manga, unpaginated. Once you add pagination or a
                dedicated /manga/browse page, point this there. */}
          </div>

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

          {mangaList.length === 0 && (
            <p className="text-[#b6b0a2] text-center mt-12 font-mono">
              No manga published yet.
            </p>
          )}

        </div>
      </section>

    </div>
  );
}