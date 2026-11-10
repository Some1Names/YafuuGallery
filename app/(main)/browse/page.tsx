import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import MangaBackground from "@/component/titles/MangaBackground";
import ShowMoreLink from "@/component/ShowMoreLink";
import MdMangaCard from "@/component/mangadex/MdMangaCard";
import MdLanguageFilter from "@/component/mangadex/MdLanguageFilter";
import { browseHref, earlierPage, pagesToFetch, parseBrowseParams, toMdLanguage } from "@/lib/mangadex/browse-params";
import { getLatest, getPopular, searchManga } from "@/lib/mangadex/queries";
import type { MdMangaSummary } from "@/lib/mangadex/types";

// /browse — the MangaDex zone's front door: search MangaDex, or with no
// query see what's popular and recently updated there. Everything is
// fetched live from MangaDex (lib/mangadex); nothing is stored here.

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Browse");
  return {
    title: t("title"),
    description: t("description"),
    // MangaDex's content isn't ours to have indexed under this site.
    robots: { index: false, follow: false },
  };
}

function Grid({ items }: { items: MdMangaSummary[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {items.map((manga) => (
        <MdMangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const locale = toMdLanguage(await getLocale());
  const { q, lang, page } = parseBrowseParams(await searchParams, locale);
  const t = await getTranslations("Browse");
  const tLanguage = await getTranslations("LanguageName");

  let body: React.ReactNode;

  if (q) {
    const pages = await Promise.all(pagesToFetch(page).map((p) => searchManga({ q, lang, page: p, locale })));
    // A title can shift between pages while they load; keep the first.
    const seen = new Set<string>();
    const items = pages.flatMap((p) => p.items).filter((m) => !seen.has(m.id) && seen.add(m.id));
    const hasMore = pages[pages.length - 1].hasMore;
    const other = lang === "th" ? "en" : lang === "en" ? "th" : null;
    // deep into the results the grid no longer starts at the first one
    const earlier = earlierPage(page);

    body =
      items.length === 0 ? (
        <p className="text-fg-secondary text-center mt-12 text-sm">
          {t("empty")}{" "}
          {other && (
            <Link
              href={browseHref({ q, lang: other })}
              className="text-fg underline underline-offset-2 hover:no-underline"
            >
              {t("emptyTryOther", { language: tLanguage(other) })}
            </Link>
          )}
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-fg-secondary wrap-anywhere">
            {t.rich("resultsFor", { query: q, q: (chunks) => <span className="text-fg">{chunks}</span> })}
          </p>
          {earlier !== null && (
            <p className="mb-5 text-sm">
              <Link
                href={browseHref({ q, lang, page: earlier })}
                className="text-fg underline underline-offset-2 hover:no-underline"
              >
                {t("earlier")}
              </Link>
            </p>
          )}
          <Grid items={items} />
          {hasMore && <ShowMoreLink href={browseHref({ q, lang, page: page + 1 })} />}
        </>
      );
  } else {
    const [popular, latest] = await Promise.all([getPopular(lang, locale), getLatest(lang, locale)]);
    body = (
      <div className="flex flex-col gap-12">
        {[
          { heading: t("popular"), items: popular },
          { heading: t("latest"), items: latest },
        ].map(({ heading, items }) => (
          <section key={heading}>
            <h2 className="mb-5 text-xl text-fg font-(family-name:--font-display)">{heading}</h2>
            {items.length === 0 ? <p className="text-fg-secondary text-sm">{t("empty")}</p> : <Grid items={items} />}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">{t("title")}</h1>
          <p className="max-w-2xl text-sm text-fg-secondary sm:text-white/70">{t("subtitle")}</p>
        </div>

        {/* A plain GET form: the query lives in the URL, so results are
            shareable and the page needs no client-side code. */}
        <form action="/browse" method="GET" role="search" className="mb-4 sm:mb-6">
          <input type="hidden" name="lang" value={lang} />
          <div className="relative max-w-xl">
            <label htmlFor="browse-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" aria-hidden="true" />
            <input
              id="browse-search"
              type="search"
              name="q"
              defaultValue={q}
              // re-mount when the URL's query changes (back/forward), since
              // defaultValue only applies on first render
              key={q}
              maxLength={200}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="w-full bg-surface border border-border rounded-md pl-10 pr-24 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-fg-secondary transition-colors duration-200"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-sm bg-fg text-bg text-sm font-medium hover:opacity-85 transition-opacity duration-200"
            >
              {t("searchButton")}
            </button>
          </div>
        </form>

        <MdLanguageFilter q={q} active={lang} />

        {body}
      </div>
    </div>
  );
}
