import type { MdLanguage } from "./types";

// Paging and language helpers for the MangaDex results on /search.

// "Show more" re-renders the grid with every page so far. To keep one
// visit from firing dozens of requests at MangaDex, only the most recent
// few pages are loaded once a reader has gone that deep.
const MAX_PAGES_PER_VISIT = 5;

// The interface locale as a chapter language. The site's interface is
// only ever en or th, but this guards the type.
export function toMdLanguage(locale: string | undefined): MdLanguage {
  return locale === "th" ? "th" : "en";
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
