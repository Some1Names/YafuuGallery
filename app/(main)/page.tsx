import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import MangaCard from "@/component/MangaCard";
import FeaturedCarousel from "@/component/titles/FeaturedCarousel";
import ContinueReadingCard from "@/component/titles/ContinueReadingCard";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import { getContinueReading } from "@/lib/continue-reading";
import { fullRowCount } from "@/lib/grid-rows";
import { parsePageCount, splitExtraRow } from "@/lib/pagination";
import ShowMoreLink from "@/component/ShowMoreLink";
import { GENRES } from "@/lib/genres";
import { searchHref } from "@/lib/search-filters";
import { getTranslations } from "next-intl/server";

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

function renderCard(manga: CardManga, unknownAuthor: string) {
  const latest = manga.chapters.slice().sort((a, b) => b.chapter_number - a.chapter_number)[0];
  const displayNumbers = getChapterDisplayNumbers(manga.chapters);
  return (
    <MangaCard
      key={manga.id}
      id={manga.id}
      title={manga.manga_title}
      author={manga.author.name ?? unknownAuthor}
      coverImageUrl={manga.cover_image_url}
      latestChapterDisplayNumber={latest ? (displayNumbers.get(latest.id) ?? null) : null}
      latestChapterIsEx={latest?.chapter_is_ex ?? false}
      latestChapterName={latest?.chapter_name ?? null}
      updatedAt={manga.updated_at}
    />
  );
}

// A section's eyebrow + heading, with an optional "See all →" link. From
// sm up the link sits at the right, level with the heading. On phones it
// moves up to the eyebrow's line so the heading gets the full width —
// beside the link, "Continue Reading" and "Browse by Genre" wrapped onto
// two lines at 320px.
function SectionHeader({
  eyebrow,
  title,
  link,
  className = "mb-6 sm:mb-8",
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string } | null;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[1fr_auto] items-center gap-x-4 ${className}`}>
      <p className="col-start-1 row-start-1 text-fg-secondary text-xs sm:text-sm">{eyebrow}</p>
      <h2 className="col-span-2 sm:col-span-1 row-start-2 text-2xl sm:text-3xl text-fg font-(family-name:--font-display)">
        {title}
      </h2>
      {link && (
        <Link
          href={link.href}
          // py/-my: a 40px-tall tap area without adding height
          className="col-start-2 row-start-1 sm:row-span-2 sm:self-end whitespace-nowrap py-2.5 -my-2.5 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
        >
          {link.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const pageCount = parsePageCount((await searchParams).page);
  const t = await getTranslations("Home");
  const tGenre = await getTranslations("Genres");
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
  // 2 columns on phones, 3 at sm, 6 from md: cards that would leave the last
  // row part-empty are hidden at that width (all are in Reading history)
  const phoneShown = fullRowCount(recentProgress.length, 2);
  const smShown = fullRowCount(recentProgress.length, 3);

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
            {/* The home page's only invitation to make an account — a card
                with real buttons, not a small text link that was easy to miss
                (and 17px tall to tap). */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-border rounded-md bg-surface/60 p-4 sm:p-5">
              <div>
                <p className="text-fg font-medium">{t("signupTitle")}</p>
                <p className="mt-0.5 text-sm text-fg-secondary">
                  {t("signupBody")}
                </p>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <Link
                  href="/signup"
                  className="flex-1 sm:flex-none flex items-center justify-center h-10 px-4 rounded-md bg-fg text-bg text-sm font-semibold whitespace-nowrap hover:bg-fg-hover transition-colors duration-200"
                >
                  {t("createAccount")}
                </Link>
                <Link
                  href="/login"
                  className="flex-1 sm:flex-none flex items-center justify-center h-10 px-4 rounded-md border border-fg/25 text-fg text-sm font-medium whitespace-nowrap hover:border-fg/60 transition-colors duration-200"
                >
                  {t("signIn")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        recentProgress.length > 0 && (
          <section className="px-6 md:px-8 pt-8 sm:pt-10 md:pt-12">
            <div className="max-w-350 mx-auto">
              <SectionHeader
                eyebrow={t("continueEyebrow")}
                title={t("continueTitle")}
                link={{ href: "/history", label: t("historyLink") }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {recentProgress.map((p, i) => (
                  <ContinueReadingCard
                    key={p.id}
                    chapterId={p.chapterId}
                    displayNumber={p.displayNumber}
                    chapterIsEx={p.chapterIsEx}
                    chapterName={p.chapterName}
                    coverImageUrl={p.coverImageUrl}
                    mangaTitle={p.mangaTitle}
                    isNext={p.isNext}
                    className={`${i >= phoneShown ? "max-sm:hidden" : ""} ${i >= smShown ? "sm:max-md:hidden" : ""}`}
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
            <SectionHeader
              eyebrow={t("popularEyebrow")}
              title={t("popularTitle")}
              link={{ href: searchHref({ sort: "views" }), label: t("seeAll") }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {popularManga.map((m) => renderCard(m, t("unknownAuthor")))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Updates */}
      <section className={"px-6 md:px-8 pt-8 " + (genresInUse.length > 0 ? "" : "pb-16 sm:pb-20 md:pb-28")}>
        <div className="max-w-350 mx-auto">

          <SectionHeader
            eyebrow={t("latestEyebrow")}
            title={t("latestTitle")}
            link={mangaList.length > 0 ? { href: "/search", label: t("browseAll") } : null}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {mangaList.map((m) => renderCard(m, t("unknownAuthor")))}
          </div>

          {mangaList.length === 0 && (
            <p className="text-fg-secondary text-center mt-12">
              {t("noneYet")}
            </p>
          )}

          {hasMoreLatest && <ShowMoreLink href={`/?page=${pageCount + 1}`} />}

        </div>
      </section>

      {/* Browse by genre — last on the page: once someone reaches the end of
          Latest Manga, picking a genre is the natural next step. Same
          header treatment as the sections above (eyebrow + display heading
          + "see all" link). Only genres something is tagged with, so no
          chip leads to an empty page; one sideways-scrolling row on phones
          (bleeding to the screen edges), wrapping from md up. */}
      {genresInUse.length > 0 && (
        <section className="px-6 md:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 md:pb-28">
          <div className="max-w-350 mx-auto">
            <SectionHeader
              eyebrow={t("genresEyebrow")}
              title={t("genresTitle")}
              link={{ href: "/search", label: t("allGenres") }}
              className="mb-5 sm:mb-6"
            />
            <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto [scrollbar-width:none]">
              <ul className="flex gap-2 w-max md:w-auto md:flex-wrap">
                {genresInUse.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={searchHref({ genre: g.slug })}
                      className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border border-border bg-surface text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
                    >
                      {tGenre(g.slug)}
                      <span className="text-xs text-fg-muted">{genreCounts.get(g.slug)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}