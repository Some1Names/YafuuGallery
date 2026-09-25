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
import { GENRES } from "@/lib/genres";
import { searchHref } from "@/lib/search-filters";

const LATEST_PAGE_SIZE = 10;
// One row of the 5-column grid. The Popular row only shows once the
// library has MORE manga than this — until then it'd be the exact same
// covers as Latest Manga right below it, just reordered.
const POPULAR_COUNT = 5;

// Every card needs the manga's chapter list to work out its latest
// chapter's display number (see lib/chapter-number.ts).
const CARD_INCLUDE = {
  author: { select: { name: true } },
  chapters: { select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true } },
} as const;

type CardManga = {
  id: string;
  manga_title: string;
  cover_image_url: string | null;
  updated_at: Date;
  author: { name: string | null };
  chapters: { id: string; chapter_number: number; chapter_is_ex: boolean; chapter_name: string }[];
};

function renderCard(manga: CardManga) {
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
}

// "See all →" beside a section heading
function SeeAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 inline-block py-1.5 -my-1.5 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
    >
      {label} <span aria-hidden="true">→</span>
    </Link>
  );
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const pageCount = parsePageCount((await searchParams).page);
  const latestLimit = pageCount * LATEST_PAGE_SIZE;

  // session doesn't depend on the manga queries (or vice versa), so all
  // three run as one round trip instead of two sequential ones.
  const [session, latestRows, curatedFeatured, mangaCount, popularManga, genreRows] = await Promise.all([
    auth(),
    prisma.manga.findMany({
      orderBy: { updated_at: "desc" },
      // one extra row just to learn whether "Show more" is needed
      take: latestLimit + 1,
      include: CARD_INCLUDE,
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
    prisma.manga.count(),
    prisma.manga.findMany({
      orderBy: [{ view_count: "desc" }, { updated_at: "desc" }],
      take: POPULAR_COUNT,
      include: CARD_INCLUDE,
    }),
    // How many manga carry each genre, for the "Browse by genre" strip —
    // only genres something is actually tagged with get a chip, so none
    // of them leads to an empty page.
    prisma.$queryRaw<{ genre: string; count: number }[]>`
      SELECT g AS genre, COUNT(*)::int AS count FROM "Manga", unnest("genres") AS g GROUP BY g`,
  ]);
  const genreCounts = new Map(genreRows.map((r) => [r.genre, r.count]));
  const genresInUse = GENRES.filter((g) => genreCounts.has(g.slug));
  const showPopular = mangaCount > POPULAR_COUNT;

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
              <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <p className="text-fg-secondary text-xs sm:text-sm">PICK UP WHERE YOU LEFT OFF</p>
                  <h2 className="text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">Continue Reading</h2>
                </div>
                <SeeAllLink href="/history" label="History" />
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
                    isNext={p.isNext}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {showPopular && (
        <section className="px-6 md:px-8 pt-8 sm:pt-10 md:pt-12">
          <div className="max-w-350 mx-auto">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-fg-secondary text-xs sm:text-sm">MOST READ</p>
                <h2 className="text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">Popular</h2>
              </div>
              <SeeAllLink href={searchHref({ sort: "views" })} label="See all" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {popularManga.map(renderCard)}
            </div>
          </div>
        </section>
      )}

      {genresInUse.length > 0 && (
        <section className="px-6 md:px-8 pt-8 sm:pt-10 md:pt-12">
          <div className="max-w-350 mx-auto">
            <h2 className="text-xl text-fg font-(family-name:--font-display) mb-4">Browse by genre</h2>
            <ul className="flex flex-wrap gap-2">
              {genresInUse.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={searchHref({ genre: g.slug })}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
                  >
                    {g.label}
                    <span className="text-xs text-fg-muted">{genreCounts.get(g.slug)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest Updates */}
      <section className="px-6 md:px-8 pt-8 pb-16 sm:pb-20 md:pb-28">
        <div className="max-w-350 mx-auto">

          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-fg-secondary text-xs sm:text-sm">
                RECENTLY UPDATED
              </p>

              <h2 className="text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">
                Latest Manga
              </h2>
            </div>
            {mangaList.length > 0 && <SeeAllLink href="/search" label="Browse all" />}

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {mangaList.map(renderCard)}
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