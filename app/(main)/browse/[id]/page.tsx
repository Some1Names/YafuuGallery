import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Languages } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import MangaBackground from "@/component/titles/MangaBackground";
import MangaSynopsis from "@/component/titles/MangaSynopsis";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import MdChapterSection from "@/component/mangadex/MdChapterSection";
import MdSourceCredit from "@/component/mangadex/MdSourceCredit";
import { toMdLanguage } from "@/lib/mangadex/browse-params";
import { isReadable } from "@/lib/mangadex/map";
import { getChapterFeed, getManga } from "@/lib/mangadex/queries";
import { MangaDexError, type MdLanguage, type MdManga } from "@/lib/mangadex/types";

// /browse/[id] — one MangaDex title: what it is, and its chapters in
// Thai or English. `id` is MangaDex's own manga id.

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// A title that doesn't exist (or that the zone refuses to show) is a 404;
// anything else — MangaDex down, rate limit — goes to browse/error.tsx.
async function loadManga(id: string, locale: MdLanguage): Promise<MdManga> {
  try {
    return await getManga(id, locale);
  } catch (err) {
    if (err instanceof MangaDexError && err.kind === "not_found") notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const robots = { index: false, follow: false };
  try {
    const { id } = await params;
    const manga = await getManga(id, toMdLanguage(await getLocale()));
    return { title: manga.title, robots };
  } catch {
    // the page itself reports the problem; metadata must not crash first
    return { robots };
  }
}

export default async function BrowseTitlePage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const locale = toMdLanguage(await getLocale());
  const manga = await loadManga(id, locale);
  const [t, tManga, tLanguage] = await Promise.all([
    getTranslations("Browse"),
    getTranslations("Manga"),
    getTranslations("LanguageName"),
  ]);

  // Only chapters that can be read here are listed — ones that just link
  // to an official site are left out. So a language counts only if it
  // has such chapters (a title can be "available in Thai" on MangaDex
  // with nothing but links).
  const feeds = await Promise.all(
    manga.languages.map(async (l) => ({ language: l, chapters: (await getChapterFeed(manga.id, l)).filter(isReadable) })),
  );
  const readable = feeds.filter((f) => f.chapters.length > 0);
  const languages = readable.map((f) => f.language);

  // Which language's chapters to list: the one asked for, else the
  // interface language, else whatever there is.
  const asked = Array.isArray(sp.lang) ? sp.lang[0] : sp.lang;
  const language: MdLanguage =
    languages.find((l) => l === asked) ?? (languages.includes(locale) ? locale : (languages[0] ?? locale));
  const chapters = readable.find((f) => f.language === language)?.chapters ?? [];
  const firstChapter = chapters[0];

  return (
    // Laid out like the site's own title page (manga/titles/[id]): wide
    // banner, then chapters on the left and the details in a right-hand
    // column that sticks below the navbar; stacked on phones.
    <div className="relative min-h-screen bg-bg px-0 sm:px-5 py-0 sm:py-12 md:py-20 flex justify-center">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 w-full max-w-350 text-fg">
        {/* Banner. MangaDex has no wide banner art, only the cover — so
            the cover is shown whole in the middle, over a blurred,
            stretched copy of itself that fills the 32:9 box. */}
        <div className="relative w-full aspect-32/9 rounded-none sm:rounded-md mb-6 sm:mb-14 overflow-hidden bg-surface">
          {manga.coverUrl ? (
            <>
              {/* Plain <img>s: thumbnails from our own cached cover route
                  (see MdMangaCard). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={manga.coverUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60"
              />
              <div className="absolute inset-0 bg-black/30" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={manga.coverUrl}
                alt=""
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain shadow-2xl"
              />
            </>
          ) : (
            <NoImagePlaceholder />
          )}
        </div>

        <div className="sm:flex sm:gap-8 sm:items-start">
          <div className="px-6 sm:px-0 mb-8 sm:mb-0 sm:order-2 sm:w-80 md:w-96 sm:shrink-0 sm:sticky sm:top-24 md:top-26">
            <h1 className="text-3xl sm:text-4xl leading-tight wrap-anywhere font-(family-name:--font-display)">
              {manga.title}
            </h1>
            {manga.authors.length > 0 && (
              <p className="text-fg-secondary text-base sm:text-lg mt-2 wrap-anywhere">{manga.authors.join(", ")}</p>
            )}

            <ul className="flex flex-wrap items-center gap-2 mt-4" aria-label={tManga("statusAndGenres")}>
              <li
                className={
                  "text-xs font-semibold px-2.5 py-1 rounded-full " +
                  (manga.status === "completed" ? "bg-fg text-bg" : "border border-fg/40 text-fg")
                }
              >
                {t(`status.${manga.status}`)}
              </li>
              {manga.genres.map((genre) => (
                <li key={genre} className="text-xs px-2.5 py-1 rounded-full border border-border text-fg-secondary">
                  {genre}
                </li>
              ))}
            </ul>

            {languages.length > 0 && (
              <p className="flex items-center gap-1.5 mt-3 text-sm text-fg-secondary">
                <Languages className="w-4 h-4 shrink-0 text-fg-muted" aria-hidden="true" />
                <span>
                  {tManga.rich("availableIn", {
                    languages: languages.map((l) => tLanguage(l)).join(" · "),
                    strong: (chunks) => <span className="text-fg">{chunks}</span>,
                  })}
                </span>
              </p>
            )}

            <div className="flex gap-2 mt-6">
              {firstChapter ? (
                <Link
                  href={`/read/${firstChapter.id}`}
                  className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-fg text-bg text-sm font-semibold hover:bg-fg-hover transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  {t("startReading")}
                </Link>
              ) : (
                <span className="flex-1 flex items-center justify-center h-11 px-4 rounded-md border border-fg/15 text-fg-muted text-sm">
                  {tManga("noChaptersYet")}
                </span>
              )}
            </div>

            <MdSourceCredit href={manga.mangadexUrl} className="mt-4" />

            {manga.synopsis && (
              <div className="mt-8 pt-6 border-t border-border whitespace-pre-line">
                <MangaSynopsis text={manga.synopsis} />
              </div>
            )}
          </div>

          <div className="px-6 sm:px-0 pb-8 sm:pb-0 sm:order-1 sm:flex-1 min-w-0">
            <MdChapterSection
              // a language switch starts the list (and its sort) afresh
              key={language}
              mangaId={manga.id}
              chapters={chapters}
              coverUrl={manga.coverUrl}
              language={language}
              languages={languages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
