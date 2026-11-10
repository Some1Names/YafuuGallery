import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import MangaBackground from "@/component/titles/MangaBackground";
import MangaSynopsis from "@/component/titles/MangaSynopsis";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { chipClass } from "@/component/manga/chip-class";
import MdChapterList from "@/component/mangadex/MdChapterList";
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

const LANGUAGE_NAMES: Record<MdLanguage, string> = { th: "ไทย", en: "English" };

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
  const t = await getTranslations("Browse");

  // Which language's chapters to list: the one asked for, else the
  // interface language if this title has it, else whatever it does have.
  const asked = Array.isArray(sp.lang) ? sp.lang[0] : sp.lang;
  const language: MdLanguage =
    manga.languages.find((l) => l === asked) ??
    (manga.languages.includes(locale) ? locale : (manga.languages[0] ?? locale));

  const feed = await getChapterFeed(manga.id, language);
  const firstReadable = feed.find(isReadable);
  const newestFirst = [...feed].reverse();

  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-10 sm:py-12 md:py-16 flex justify-center">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 w-full max-w-350 text-fg">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 py-2 mb-4 text-sm text-fg-secondary sm:text-white/70 hover:text-fg sm:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t("backToBrowse")}
        </Link>

        {/* Same shape as our own title page: details in a right-hand
            column that sticks below the navbar, chapters on the left;
            stacked (details first) on phones. */}
        <div className="sm:flex sm:gap-8 sm:items-start">
          <div className="mb-8 sm:mb-0 sm:order-2 sm:w-80 md:w-96 sm:shrink-0 sm:sticky sm:top-24 md:top-26">
            <div className="flex gap-4 sm:block">
              <div className="relative w-28 sm:w-48 shrink-0 aspect-2/3 rounded-lg overflow-hidden bg-surface sm:mb-5">
                {manga.coverUrl ? (
                  // Plain <img>: already a sized thumbnail from our own
                  // cached cover route (see MdMangaCard).
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={manga.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <NoImagePlaceholder />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl sm:text-4xl leading-tight wrap-anywhere font-(family-name:--font-display)">
                  {manga.title}
                </h1>
                {manga.authors.length > 0 && (
                  <p className="mt-2 text-fg-secondary text-sm sm:text-lg wrap-anywhere">
                    {t("by", { authors: manga.authors.join(", ") })}
                  </p>
                )}
              </div>
            </div>

            <ul className="flex flex-wrap items-center gap-2 mt-4">
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

            <MdSourceCredit href={manga.mangadexUrl} className="mt-4" />

            {firstReadable && (
              <Link
                href={`/read/${firstReadable.id}`}
                className="flex items-center justify-center gap-2 h-11 px-4 mt-6 rounded-md bg-fg text-bg text-sm font-semibold hover:bg-fg-hover transition-colors duration-200"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {t("startReading")}
              </Link>
            )}

            {manga.synopsis && (
              <div className="mt-8 pt-6 border-t border-border whitespace-pre-line">
                <MangaSynopsis text={manga.synopsis} />
              </div>
            )}
          </div>

          <div className="sm:order-1 sm:flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="text-xl font-(family-name:--font-display)">
                {t("chapters")}
                <span className="ml-2 align-middle text-xs text-fg-muted font-(family-name:--font-body) font-medium">
                  {feed.length}
                </span>
              </h2>

              {manga.languages.length > 1 && (
                <nav aria-label={t("langLabel")}>
                  <ul className="flex gap-2">
                    {manga.languages.map((l) => (
                      <li key={l}>
                        <Link
                          href={`/browse/${manga.id}?lang=${l}`}
                          scroll={false}
                          aria-current={l === language ? "true" : undefined}
                          className={chipClass(l === language) + " inline-block" + (l === language ? "" : " bg-surface")}
                        >
                          {LANGUAGE_NAMES[l]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>

            <MdChapterList chapters={newestFirst} emptyText={t("noChapters")} />
          </div>
        </div>
      </div>
    </div>
  );
}
