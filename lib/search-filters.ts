import { isGenreSlug, isMangaStatus, type GenreSlug, type MangaStatusValue } from "@/lib/genres";

// /search's URL state: ?q=&genre=&status=&sort=&page=. Kept in the URL
// (not client state) like the query itself, so every filtered view is a
// plain shareable link and the page stays fully server-rendered.

export const SORTS = [
  // short labels so all four fit on one line on a phone
  { value: "updated", label: "Updated" },
  { value: "new", label: "Newest" },
  { value: "views", label: "Popular" }, // most viewed
  { value: "title", label: "A–Z" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];
export const DEFAULT_SORT: SortValue = "updated";

export interface SearchFilters {
  q: string;
  genre: GenreSlug | null;
  status: MangaStatusValue | null;
  sort: SortValue;
}

function first(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

// Anything unrecognised (a hand-edited ?genre=xyz) quietly falls back to
// "no filter" instead of producing an empty page.
export function parseSearchFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
  const genre = first(params.genre);
  const status = first(params.status);
  const sort = first(params.sort);
  return {
    q: (first(params.q) ?? "").trim(),
    genre: isGenreSlug(genre) ? genre : null,
    status: isMangaStatus(status) ? status : null,
    sort: SORTS.some((s) => s.value === sort) ? (sort as SortValue) : DEFAULT_SORT,
  };
}

// Builds a /search URL, leaving out defaults so links stay short
// (/search?genre=action, not /search?q=&genre=action&status=&sort=updated).
export function searchHref(filters: Partial<SearchFilters>, page?: number): string {
  const params = new URLSearchParams();
  const q = filters.q?.trim();
  if (q) params.set("q", q);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.status) params.set("status", filters.status);
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}
