import type { GenreSlug, MangaStatusValue } from "@/lib/genres";
import { DEFAULT_SORT, type SortValue } from "@/lib/search-filters";
import { cleanSearchText, isUuid, mdFetch, type MdParams } from "./client";
import { GENRE_TAG_IDS } from "./genre-tags";
import { sortChapters, toChapter, toManga, toMangaSummary } from "./map";
import {
  MD_CONTENT_RATINGS,
  MD_LANGUAGES,
  MangaDexError,
  type MdChapter,
  type MdLanguage,
  type MdManga,
  type MdMangaSummary,
  type RawAtHome,
  type RawChapter,
  type RawCollection,
  type RawEntity,
  type RawManga,
} from "./types";

// Every question the MangaDex zone asks the API. Pages call these, never
// mdFetch directly, so the rules that must hold everywhere (content
// rating, languages, caching times) live in one file.

export type MdLanguageFilter = MdLanguage | "all";
export const MD_PAGE_SIZE = 24;

// MangaDex refuses offset + limit > 10000.
const MAX_PAGE = 400;

const CACHE = { lists: 300, manga: 3600, feed: 600, chapter: 3600 } as const;

const FEED_PAGE_SIZE = 500;
const FEED_MAX_REQUESTS = 10;

// /search's sort choices in MangaDex's terms. "views" has no equal
// there (MangaDex doesn't publish view counts); follows is its measure
// of popularity.
const ORDER: Record<SortValue, Record<string, string>> = {
  updated: { latestUploadedChapter: "desc" },
  new: { createdAt: "desc" },
  views: { followedCount: "desc" },
  title: { title: "asc" },
};

// One page of MangaDex titles for /search, under the same filters as
// the site's own manga: search text, genre, status and sort, plus the
// chapter language (which only MangaDex has).
export async function listManga(a: {
  q: string;
  genre: GenreSlug | null;
  status: MangaStatusValue | null;
  sort: SortValue;
  lang: MdLanguageFilter;
  page: number;
  locale: MdLanguage;
}): Promise<{ items: MdMangaSummary[]; total: number; hasMore: boolean }> {
  const q = cleanSearchText(a.q);
  const page = Math.min(Math.max(Math.trunc(a.page) || 1, 1), MAX_PAGE);
  const offset = (page - 1) * MD_PAGE_SIZE;
  // A search left on the default sort is ordered by how well titles
  // match — "recently updated" would bury the title that was typed.
  const order = q && a.sort === DEFAULT_SORT ? { relevance: "desc" } : ORDER[a.sort];

  const params: MdParams = {
    ...(q ? { title: q } : {}),
    limit: MD_PAGE_SIZE,
    offset,
    includes: ["cover_art"],
    contentRating: MD_CONTENT_RATINGS,
    availableTranslatedLanguage: a.lang === "all" ? MD_LANGUAGES : [a.lang],
    hasAvailableChapters: "true",
    ...(a.genre ? { includedTags: [GENRE_TAG_IDS[a.genre]] } : {}),
    ...(a.status ? { status: [a.status] } : {}),
    order,
  };

  const res = await mdFetch<RawCollection<RawManga>>("/manga", params, { revalidate: CACHE.lists });
  const total = res.total ?? 0;

  return {
    items: (res.data ?? []).map((m) => toMangaSummary(m, a.locale)),
    total,
    hasMore: page < MAX_PAGE && offset + MD_PAGE_SIZE < total,
  };
}

function allowedRating(raw: RawManga): boolean {
  return (MD_CONTENT_RATINGS as readonly string[]).includes(raw.attributes?.contentRating ?? "");
}

// One title. A title outside the allowed content ratings is reported as
// not found — same as one that doesn't exist — so a direct link to it
// shows the 404 page.
export async function getManga(id: string, locale: MdLanguage): Promise<MdManga> {
  if (!isUuid(id)) throw new MangaDexError("not_found");
  const res = await mdFetch<RawEntity<RawManga>>(
    `/manga/${id}`,
    { includes: ["cover_art", "author", "artist"] },
    { revalidate: CACHE.manga },
  );
  if (!res.data || !allowedRating(res.data)) throw new MangaDexError("not_found");
  return toManga(res.data, locale);
}

// Every chapter of a title in one language, in reading order. The API
// gives at most 500 per request, and long series have more (One Piece
// has over a thousand), so this keeps asking until it has them all.
export async function getChapterFeed(mangaId: string, language: MdLanguage): Promise<MdChapter[]> {
  if (!isUuid(mangaId)) throw new MangaDexError("not_found");

  const chapters: MdChapter[] = [];
  const seen = new Set<string>();
  for (let request = 0; request < FEED_MAX_REQUESTS; request++) {
    const offset = request * FEED_PAGE_SIZE;
    const res = await mdFetch<RawCollection<RawChapter>>(
      `/manga/${mangaId}/feed`,
      {
        limit: FEED_PAGE_SIZE,
        offset,
        translatedLanguage: [language],
        contentRating: MD_CONTENT_RATINGS,
        includes: ["scanlation_group"],
        order: { chapter: "asc" },
      },
      { revalidate: CACHE.feed },
    );
    for (const raw of res.data ?? []) {
      // The feed's pages are fetched (and cached) one by one, so a
      // chapter added in between can shift one onto two pages.
      if (seen.has(raw.id)) continue;
      seen.add(raw.id);
      const chapter = toChapter(raw);
      if (chapter) chapters.push(chapter);
    }
    if (offset + FEED_PAGE_SIZE >= (res.total ?? 0)) break;
  }

  return sortChapters(chapters);
}

// One chapter and the title it belongs to. Also loads that title, so a
// chapter of a title outside the allowed content ratings is not found.
export async function getChapter(id: string): Promise<{ chapter: MdChapter; mangaId: string }> {
  if (!isUuid(id)) throw new MangaDexError("not_found");
  const res = await mdFetch<RawEntity<RawChapter>>(
    `/chapter/${id}`,
    { includes: ["scanlation_group", "manga"] },
    { revalidate: CACHE.chapter },
  );

  const chapter = res.data ? toChapter(res.data) : null;
  const mangaId = res.data?.relationships?.find((r) => r.type === "manga")?.id;
  if (!chapter || !mangaId) throw new MangaDexError("not_found");

  await getManga(mangaId, "en");
  return { chapter, mangaId };
}

// How long one chapter's page addresses are reused. They stay valid for
// several minutes, so a minute is safe — and it means reloads, several
// readers on one chapter, or someone hammering the pages route cost one
// MangaDex request a minute per chapter, not one each (the at-home
// endpoint has the tightest rate limit of the API).
export const PAGES_CACHE_MS = 60_000;
const PAGES_CACHE_MAX = 500;
const pagesCache = new Map<string, { at: number; urls: string[] }>();

// Empties that cache. Tests use it to start clean.
export function forgetChapterPages(): void {
  pagesCache.clear();
}

// The page images of a chapter, as URLs the reader's browser loads
// straight from MangaDex's image network (data-saver quality). Kept out
// of Next's data cache (the server address in them is short-lived) and
// held in memory for PAGES_CACHE_MS only.
export async function getChapterPages(id: string): Promise<string[]> {
  if (!isUuid(id)) throw new MangaDexError("not_found");

  const cached = pagesCache.get(id);
  if (cached && Date.now() - cached.at < PAGES_CACHE_MS) return cached.urls;

  const res = await mdFetch<RawAtHome>(`/at-home/server/${id}`, undefined, { revalidate: false });

  const files = res.chapter?.dataSaver;
  const hash = res.chapter?.hash;
  if (!Array.isArray(files) || files.length === 0 || !hash || !/^https:\/\//.test(res.baseUrl ?? "")) {
    throw new MangaDexError("unavailable", "MangaDex returned no pages for this chapter");
  }
  const urls = files.map((file) => `${res.baseUrl}/data-saver/${hash}/${encodeURIComponent(file)}`);

  // Map keeps insertion order, so the first key is the oldest entry.
  if (pagesCache.size >= PAGES_CACHE_MAX) pagesCache.delete(pagesCache.keys().next().value as string);
  pagesCache.delete(id);
  pagesCache.set(id, { at: Date.now(), urls });
  return urls;
}
