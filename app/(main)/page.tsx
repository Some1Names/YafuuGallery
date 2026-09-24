import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import MangaCard from "@/component/MangaCard";
import FeaturedCarousel from "@/component/titles/FeaturedCarousel";
import ContinueReadingCard from "@/component/titles/ContinueReadingCard";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import { getContinueReading } from "@/lib/continue-reading";
import { parsePageCount, splitExtraRow } from "@/lib/pagination";
import ShowMoreLink from "@/component/ShowMoreLink";

const LATEST_PAGE_SIZE = 10;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const pageCount = parsePageCount((await searchParams).page);
  const latestLimit = pageCount * LATEST_PAGE_SIZE;

  // session doesn't depend on the manga queries (or vice versa), so all
  // three run as one round trip instead of two sequential ones.
  const [session, latestRows, curatedFeatured] = await Promise.all([
    auth(),
    prisma.manga.findMany({
      orderBy: { updated_at: "desc" },
      // one extra row just to learn whether "Show more" is needed
      take: latestLimit + 1,
      include: {
        author: { select: { name: true } },
        // chapter_number is a 0-indexed sort key, not the number shown to
        // readers, and doesn't skip "ex" entries — computing the real
        // display number needs every chapter, not just the highest
        // chapter_number one (see lib/chapter-number.ts)
        chapters: {
          select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
        },
      },
    }),
    // Home page hero — admin-curated via the "Featured" toggle in the admin
    // panel (is_featured + featured_order, set in the order manga were
    // toggled on). Falls back to the single most-viewed manga so the hero
    // is never empty on a fresh install where nothing's been curated yet.
    prisma.manga.findMany({
      where: { is_featured: true },
      orderBy: { featured_order: "asc" },
      take: 8,
      include: {
        chapters: { orderBy: { chapter_number: "asc" }, take: 1, select: { id: true } },
      },
    }),
  ]);

  const { items: mangaList, hasMore: hasMoreLatest } = splitExtraRow(latestRows, latestLimit);

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

  // Logged-in users with no history yet just skip the section entirely —
  // unlike the profile page's own "no history yet" placeholder, an empty
  // box has no real use on a landing page. Logged-out visitors get a
  // small sign-in nudge instead (below), since for them the section isn't
  // "empty," it's unavailable until they have an account to track against.
  const recentProgress = session?.user?.id ? await getContinueReading(session.user.id, 6) : [];

  return (
    <div className="bg-bg min-h-screen">

      {/* Hero */}
      <section className="relative min-h-100 sm:min-h-125 md:min-h-150 pt-0 sm:pt-24 md:pt-28">
        {/* background image hidden on phone — the featured box itself
            becomes the hero there, edge to edge, no separate backdrop.
            Faded to a texture: at full strength this sketch competed with
            the (also sketch-drawn) featured banner in front of it. Light
            mode needs its own treatment — the sketch is gray lines on white
            paper, so a plain fade over the cream background washed it out
            to nothing; multiply drops the white paper and keeps just the
            lines, as ink, at a higher strength. */}
        <div
          className="hidden sm:block absolute inset-0 bg-cover bg-center opacity-20 [.light_&]:opacity-55 [.light_&]:mix-blend-multiply"
          style={{
            backgroundImage: `url('/mangabg.png')`,
          }}
        />

        <div className="hidden sm:block absolute inset-0 bg-linear-to-t from-bg via-bg/80 to-transparent" />

        <FeaturedCarousel manga={featuredSlides} />
      </section>

      {/* Continue reading. Three states: signed out gets a small nudge
          (no cards to show anyway), signed in with history gets the real
          section, signed in with none yet gets nothing — a brand-new
          account doesn't need to be told it has no history. */}
      {!session?.user?.id ? (
        <section className="px-6 md:px-8 pt-6 sm:pt-8">
          <div className="max-w-350 mx-auto">
            <p className="text-fg-secondary text-sm">
              <Link href="/login" className="text-fg underline underline-offset-2 hover:no-underline">
                Sign in
              </Link>{" "}
              to keep track of what you&apos;re reading.
            </p>
          </div>
        </section>
      ) : (
        recentProgress.length > 0 && (
          <section className="px-6 md:px-8 pt-8 sm:pt-10 md:pt-12">
            <div className="max-w-350 mx-auto">
              <div className="mb-6 sm:mb-8">
                <p className="text-fg-secondary text-xs sm:text-sm">PICK UP WHERE YOU LEFT OFF</p>
                <h2 className="text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">Continue Reading</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {recentProgress.map((p) => (
                  <ContinueReadingCard
                    key={p.id}
                    chapterId={p.chapterId}
                    displayNumber={p.displayNumber}
                    chapterIsEx={p.chapterIsEx}
                    chapterName={p.chapterName}
                    coverImageUrl={p.coverImageUrl}
                    mangaTitle={p.mangaTitle}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {/* Latest Updates */}
      <section className="px-6 md:px-8 pt-8 pb-16 sm:pb-20 md:pb-28">
        <div className="max-w-350 mx-auto">

          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-fg-secondary text-xs sm:text-sm">
                RECENTLY UPDATED
              </p>

              <h2 className="text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">
                Latest Manga
              </h2>
            </div>

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
            <p className="text-fg-secondary text-center mt-12">
              No manga published yet.
            </p>
          )}

          {hasMoreLatest && <ShowMoreLink href={`/?page=${pageCount + 1}`} />}

        </div>
      </section>

    </div>
  );
}