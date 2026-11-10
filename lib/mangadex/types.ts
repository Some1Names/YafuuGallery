// Shapes for the MangaDex zone (/browse, /read). Two layers:
//   Raw*  — the parts of MangaDex's API JSON we actually read
//   Md*   — what the pages and components work with (built in map.ts)

// ---------- App-facing ----------

// The only chapter languages the zone offers.
export type MdLanguage = "th" | "en";
export const MD_LANGUAGES: readonly MdLanguage[] = ["th", "en"];

// The only content ratings ever requested or shown. "erotica" and
// "pornographic" are refused everywhere, including direct links.
export const MD_CONTENT_RATINGS = ["safe", "suggestive"] as const;

export type MdStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

export interface MdMangaSummary {
  id: string;
  title: string;
  // our own /api/mangadex/cover/... path — browsers can't load covers
  // from MangaDex directly
  coverUrl: string | null;
  status: MdStatus;
  // which of th/en this title has chapters in, th first
  languages: MdLanguage[];
}

export interface MdManga extends MdMangaSummary {
  synopsis: string;
  genres: string[];
  authors: string[];
  // tagged "Long Strip" (webtoon) — always read as a vertical scroll
  longStrip: boolean;
  // which way horizontal mode turns pages: rtl for Japanese originals
  direction: "rtl" | "ltr";
  mangadexUrl: string;
}

export interface MdChapter {
  id: string;
  // "12", "12.5", sometimes "12a" or "Extra"; null for oneshots
  number: string | null;
  // only matters for series that restart chapter numbers every volume
  volume: string | null;
  title: string | null;
  language: MdLanguage;
  // scanlation group names, shown as credit
  groups: string[];
  publishedAt: string;
  pages: number;
  // set when the chapter lives on an official site (e.g. MangaPlus) —
  // there are no page images to show, only a link out
  externalUrl: string | null;
}

export type MdErrorKind = "not_found" | "rate_limited" | "unavailable";

export class MangaDexError extends Error {
  constructor(
    public kind: MdErrorKind,
    message?: string,
  ) {
    super(message ?? `MangaDex: ${kind}`);
    this.name = "MangaDexError";
  }
}

// ---------- Raw API ----------

export interface RawRelationship {
  id: string;
  type: string;
  // only present when the request asked for it with includes[]
  attributes?: Record<string, unknown> | null;
}

export interface RawTag {
  id: string;
  attributes: { name: Record<string, string>; group: string };
}

export interface RawManga {
  id: string;
  type: "manga";
  attributes: {
    title: Record<string, string>;
    altTitles?: Record<string, string>[];
    description?: Record<string, string>;
    originalLanguage?: string;
    status?: string;
    contentRating?: string;
    tags?: RawTag[];
    availableTranslatedLanguages?: (string | null)[];
  };
  relationships: RawRelationship[];
}

export interface RawChapter {
  id: string;
  type: "chapter";
  attributes: {
    chapter: string | null;
    volume?: string | null;
    title: string | null;
    translatedLanguage: string;
    externalUrl: string | null;
    isUnavailable?: boolean;
    publishAt?: string;
    readableAt?: string;
    pages: number;
  };
  relationships: RawRelationship[];
}

export interface RawCollection<T> {
  result: string;
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface RawEntity<T> {
  result: string;
  data: T;
}

export interface RawAtHome {
  result: string;
  baseUrl: string;
  chapter: { hash: string; data: string[]; dataSaver: string[] };
}
