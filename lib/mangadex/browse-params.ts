import { cleanSearchText } from "./client";
import type { MdLanguage } from "./types";
import type { MdLanguageFilter } from "./queries";

// /browse's URL parameters (?q=&lang=&page=), read and written in one
// place so the page, the language links and "Show more" agree.

type Param = string | string[] | undefined;
const first = (value: Param) => (Array.isArray(value) ? value[0] : value);

// MangaDex refuses results past 10,000 — 400 pages of 24.
const MAX_PAGE = 400;

// "Show more" re-renders the grid with every page so far. To keep one
// visit from firing dozens of requests at MangaDex, only the most recent
// few pages are loaded once a reader has gone that deep.
const MAX_PAGES_PER_VISIT = 5;

// The interface locale as a chapter language. The site's interface is
// only ever en or th, but this guards the type.
export function toMdLanguage(locale: string | undefined): MdLanguage {
  return locale === "th" ? "th" : "en";
}

export function parseBrowseParams(
  sp: { q?: Param; lang?: Param; page?: Param },
  locale: MdLanguage,
): { q: string; lang: MdLanguageFilter; page: number } {
  const lang = first(sp.lang);
  const pageText = first(sp.page) ?? "";
  const page = /^\d+$/.test(pageText) ? Number(pageText) : 1;

  return {
    q: cleanSearchText(first(sp.q)),
    lang: lang === "all" || lang === "th" || lang === "en" ? lang : locale,
    page: Math.min(Math.max(page, 1), MAX_PAGE),
  };
}

export function browseHref(p: { q?: string; lang?: MdLanguageFilter; page?: number }): string {
  const parts: string[] = [];
  if (p.q) parts.push(`q=${encodeURIComponent(p.q)}`);
  if (p.lang) parts.push(`lang=${p.lang}`);
  if (p.page && p.page > 1) parts.push(`page=${p.page}`);
  return "/browse" + (parts.length ? `?${parts.join("&")}` : "");
}

export function pagesToFetch(page: number): number[] {
  const from = Math.max(1, page - MAX_PAGES_PER_VISIT + 1);
  return Array.from({ length: page - from + 1 }, (_, i) => from + i);
}

// Past MAX_PAGES_PER_VISIT pages the grid no longer starts at the first
// result. The page to link to for what came before, or null when nothing
// was left out.
export function earlierPage(page: number): number | null {
  const from = pagesToFetch(page)[0];
  return from > 1 ? from - 1 : null;
}
