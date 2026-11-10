import { cleanSearchText, isUuid, mdFetch, type MdParams } from "./client";
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

function listParams(lang: MdLanguageFilter, limit: number, offset: number, order: Record<string, string>): MdParams {
  return {
    limit,
    offset,
    includes: ["cover_art"],
    contentRating: MD_CONTENT_RATINGS,
    availableTranslatedLanguage: lang === "all" ? MD_LANGUAGES : [lang],
    hasAvailableChapters: "true",
    order,
  };
}

export async function searchManga(a: {
  q: string;
  lang: MdLanguageFilter;
  page: number;
  locale: MdLanguage;
}): Promise<{ items: MdMangaSummary[]; hasMore: boolean }> {
  const q = cleanSearchText(a.q);
  const page = Math.min(Math.max(Math.trunc(a.page) || 1, 1), MAX_PAGE);
  const offset = (page - 1) * MD_PAGE_SIZE;

  const res = await mdFetch<RawCollection<RawManga>>(
    "/manga",
    {
      ...(q ? { title: q } : {}),
      ...listParams(a.lang, MD_PAGE_SIZE, offset, q ? { relevance: "desc" } : { followedCount: "desc" }),
    },
    { revalidate: CACHE.lists },
  );

  return {
    items: (res.data ?? []).map((m) => toMangaSummary(m, a.locale)),
    hasMore: page < MAX_PAGE && offset + MD_PAGE_SIZE < (res.total ?? 0),
  };
}

async function topManga(lang: MdLanguageFilter, locale: MdLanguage, order: Record<string, string>) {
  const res = await mdFetch<RawCollection<RawManga>>("/manga", listParams(lang, 12, 0, order), {
    revalidate: CACHE.lists,
  });
  return (res.data ?? []).map((m) => toMangaSummary(m, locale));
}

export function getPopular(lang: MdLanguageFilter, locale: MdLanguage): Promise<MdMangaSummary[]> {
  return topManga(lang, locale, { followedCount: "desc" });
}

export function getLatest(lang: MdLanguageFilter, locale: MdLanguage): Promise<MdMangaSummary[]> {
  return topManga(lang, locale, { latestUploadedChapter: "desc" });
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

// The page images of a chapter, as URLs the reader's browser loads
// straight from MangaDex's image network (data-saver quality). Never
// cached: the server address in them is only good for a few minutes.
export async function getChapterPages(id: string): Promise<string[]> {
  if (!isUuid(id)) throw new MangaDexError("not_found");
  const res = await mdFetch<RawAtHome>(`/at-home/server/${id}`, undefined, { revalidate: false });

  const files = res.chapter?.dataSaver;
  const hash = res.chapter?.hash;
  if (!Array.isArray(files) || files.length === 0 || !hash || !/^https:\/\//.test(res.baseUrl ?? "")) {
    throw new MangaDexError("unavailable", "MangaDex returned no pages for this chapter");
  }
  return files.map((file) => `${res.baseUrl}/data-saver/${hash}/${encodeURIComponent(file)}`);
}
