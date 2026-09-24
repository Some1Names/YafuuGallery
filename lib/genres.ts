// The fixed genre list authors pick from. Stored on Manga.genres as the
// slug (stable, URL-safe: /search?genre=slice-of-life); the label is only
// for display, so it can be reworded without touching the database.
// Removing a slug here hides it everywhere (parseGenres drops unknown
// ones) but leaves it in existing rows until those manga are next saved.
export const GENRES = [
  { slug: "action", label: "Action" },
  { slug: "adventure", label: "Adventure" },
  { slug: "comedy", label: "Comedy" },
  { slug: "drama", label: "Drama" },
  { slug: "fantasy", label: "Fantasy" },
  { slug: "historical", label: "Historical" },
  { slug: "horror", label: "Horror" },
  { slug: "mystery", label: "Mystery" },
  { slug: "psychological", label: "Psychological" },
  { slug: "romance", label: "Romance" },
  { slug: "school-life", label: "School Life" },
  { slug: "sci-fi", label: "Sci-Fi" },
  { slug: "slice-of-life", label: "Slice of Life" },
  { slug: "sports", label: "Sports" },
  { slug: "supernatural", label: "Supernatural" },
  { slug: "thriller", label: "Thriller" },
] as const;

export type GenreSlug = (typeof GENRES)[number]["slug"];

const LABELS = new Map<string, string>(GENRES.map((g) => [g.slug, g.label]));

export function isGenreSlug(value: unknown): value is GenreSlug {
  return typeof value === "string" && LABELS.has(value);
}

export function genreLabel(slug: string): string {
  return LABELS.get(slug) ?? slug;
}

// Request body → a clean list: known slugs only, no duplicates, in the
// list's own order (so the manga page always shows them consistently).
export function parseGenres(input: unknown): GenreSlug[] {
  if (!Array.isArray(input)) return [];
  const picked = new Set(input.filter(isGenreSlug));
  return GENRES.map((g) => g.slug).filter((slug) => picked.has(slug));
}

// Same list, kept in order, for display — drops slugs no longer on it.
export function knownGenres(slugs: string[]): GenreSlug[] {
  return parseGenres(slugs);
}

export const MANGA_STATUSES = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
] as const;

export type MangaStatusValue = (typeof MANGA_STATUSES)[number]["value"];

export function isMangaStatus(value: unknown): value is MangaStatusValue {
  return value === "ongoing" || value === "completed";
}
