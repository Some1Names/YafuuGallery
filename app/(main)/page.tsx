import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import FeaturedCarousel from "@/component/titles/FeaturedCarousel";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

export default async function BrowsePage() {
  const mangaList = await prisma.manga.findMany({
    orderBy: { updated_at: "desc" },
    include: {
      author: { select: { name: true } },
      // chapter_number is a 0-indexed sort key, not the number shown to
      // readers, and doesn't skip "ex" entries — computing the real display
      // number needs every chapter, not just the highest chapter_number one
      // (see lib/chapter-number.ts)
      chapters: {
        select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
      },
    },
  });

  // Home page hero — admin-curated via the "Featured" toggle in the admin
  // panel (is_featured + featured_order, set in the order manga were
  // toggled on). Falls back to the single most-viewed manga so the hero
  // is never empty on a fresh install where nothing's been curated yet.
  const curatedFeatured = await prisma.manga.findMany({
    where: { is_featured: true },
    orderBy: { featured_order: "asc" },
    take: 8,
    include: {
      chapters: { orderBy: { chapter_number: "asc" }, take: 1, select: { id: true } },
    },
  });

  let featuredManga = curatedFeatured;
  if (featuredManga.length === 0) {
    const viewStats = await prisma.chapter.groupBy({
      by: ["manga_id"],
      _sum: { view_count: true },
      orderBy: { _sum: { view_count: "desc" } },
      take: 1,
    });
    const fallbackId = viewStats[0]?.manga_id ?? mangaList[0]?.id ?? null;
    const fallbackManga = fallbackId
      ? await prisma.manga.findUnique({
          where: { id: fallbackId },
          include: {
            chapters: { orderBy: { chapter_number: "asc" }, take: 1, select: { id: true } },
          },
        })
      : null;
    featuredManga = fallbackManga ? [fallbackManga] : [];
  }

  const featuredSlides = featuredManga.map((m) => ({
    id: m.id,
    title: m.manga_title,
    synopsis: m.manga_synopsis,
    bannerImageUrl: m.banner_image_url,
    firstChapterId: m.chapters[0]?.id ?? null,
  }));

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

        <FeaturedCarousel manga={featuredSlides} />
      </section>

      {/* Latest Updates */}
      <section className="px-6 md:px-8 pt-8 pb-16 sm:pb-20 md:pb-28">
        <div className="max-w-350 mx-auto">

          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-[#b6b0a2] text-xs sm:text-sm">
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

          {mangaList.length === 0 && (
            <p className="text-[#b6b0a2] text-center mt-12">
              No manga published yet.
            </p>
          )}

        </div>
      </section>

    </div>
  );
}