import {
  MD_LANGUAGES,
  type MdChapter,
  type MdLanguage,
  type MdManga,
  type MdMangaSummary,
  type MdStatus,
  type RawChapter,
  type RawManga,
  type RawRelationship,
} from "./types";

// Pure functions from MangaDex's API JSON to the shapes the pages use,
// plus chapter ordering and previous/next. No fetching here.

// Pick the text for the reader's interface language out of a MangaDex
// localized-string map: that language, else English, else whatever is
// first. Titles also come with altTitles (a list of one-language maps) —
// many manga have only a romanized main title (One Piece's is "ja-ro")
// and keep the Thai and English names there.
export function pickLocalized(
  map: Record<string, string> | undefined,
  locale: MdLanguage,
  alt: Record<string, string>[] = [],
): string {
  const fromAlt = (lang: string) => alt.find((a) => a[lang])?.[lang];
  return (
    map?.[locale] ||
    fromAlt(locale) ||
    map?.en ||
    fromAlt("en") ||
    Object.values(map ?? {}).find(Boolean) ||
    ""
  );
}

// The cover as a path on our own site (the pass-through route), since a
// browser asking MangaDex for it directly gets a bot challenge.
export function coverPath(mangaId: string, relationships: RawRelationship[], size: 256 | 512 = 256): string | null {
  const fileName = relationships.find((r) => r.type === "cover_art")?.attributes?.fileName;
  if (typeof fileName !== "string" || !fileName) return null;
  return `/api/mangadex/cover/${mangaId}/${fileName}?size=${size}`;
}

const STATUSES: readonly MdStatus[] = ["ongoing", "completed", "hiatus", "cancelled"];

export function toMangaSummary(raw: RawManga, locale: MdLanguage): MdMangaSummary {
  const a = raw.attributes;
  const available = a.availableTranslatedLanguages ?? [];
  return {
    id: raw.id,
    title: pickLocalized(a.title, locale, a.altTitles),
    coverUrl: coverPath(raw.id, raw.relationships),
    status: STATUSES.find((s) => s === a.status) ?? "ongoing",
    languages: MD_LANGUAGES.filter((l) => available.includes(l)),
  };
}

export function toManga(raw: RawManga, locale: MdLanguage): MdManga {
  const a = raw.attributes;
  const tags = a.tags ?? [];
  const authors = raw.relationships
    .filter((r) => r.type === "author" || r.type === "artist")
    .map((r) => r.attributes?.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0);

  return {
    ...toMangaSummary(raw, locale),
    coverUrl: coverPath(raw.id, raw.relationships, 512),
    synopsis: pickLocalized(a.description, locale),
    genres: tags.filter((t) => t.attributes.group === "genre").map((t) => t.attributes.name.en).filter(Boolean),
    authors: [...new Set(authors)],
    longStrip: tags.some((t) => t.attributes.name.en === "Long Strip"),
    // MangaDex has no reading-direction field. Japanese manga read right
    // to left; nearly everything else (manhwa, manhua, western) left to
    // right.
    direction: (a.originalLanguage ?? "ja") === "ja" ? "rtl" : "ltr",
    mangadexUrl: `https://mangadex.org/title/${raw.id}`,
  };
}

// null: a chapter the zone never shows (taken down, or not Thai/English).
export function toChapter(raw: RawChapter): MdChapter | null {
  const a = raw.attributes;
  if (a.isUnavailable) return null;
  const language = MD_LANGUAGES.find((l) => l === a.translatedLanguage);
  if (!language) return null;

  const groups = raw.relationships
    .filter((r) => r.type === "scanlation_group")
    .map((r) => r.attributes?.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0);

  return {
    id: raw.id,
    number: a.chapter?.trim() || null,
    title: a.title?.trim() || null,
    language,
    groups,
    publishedAt: a.readableAt ?? a.publishAt ?? "",
    pages: a.pages ?? 0,
    externalUrl: a.externalUrl || null,
  };
}

// A chapter whose pages we can show: hosted on MangaDex, not a link to
// an official site.
export function isReadable(c: MdChapter): boolean {
  return c.pages > 0 && !c.externalUrl;
}

function chapterValue(c: MdChapter): number | null {
  if (c.number === null) return null;
  const n = Number.parseFloat(c.number);
  return Number.isFinite(n) ? n : null;
}

// Reading order: by chapter number as a number ("9" before "10"),
// several uploads of one number by date, unnumbered chapters last.
export function sortChapters(chapters: MdChapter[]): MdChapter[] {
  return [...chapters].sort((x, y) => {
    const a = chapterValue(x);
    const b = chapterValue(y);
    if (a === null && b === null) return x.publishedAt.localeCompare(y.publishedAt);
    if (a === null) return 1;
    if (b === null) return -1;
    return a - b || x.publishedAt.localeCompare(y.publishedAt);
  });
}

// The chapters before and after `currentId` for the reader's buttons.
// `sorted` is one language's feed in reading order. The neighbour is the
// nearest *different* chapter number that can be read here; when several
// groups uploaded it, the one the reader is already following wins, else
// the earliest upload.
export function adjacentChapters(
  sorted: MdChapter[],
  currentId: string,
): { prev: MdChapter | null; next: MdChapter | null } {
  const current = sorted.find((c) => c.id === currentId);
  const at = current ? chapterValue(current) : null;
  if (!current || at === null) return { prev: null, next: null };

  const candidates = sorted.filter((c) => isReadable(c) && chapterValue(c) !== null);

  const pick = (direction: 1 | -1): MdChapter | null => {
    const beyond = candidates.filter((c) => (chapterValue(c)! - at) * direction > 0);
    if (beyond.length === 0) return null;
    const nearest = beyond.reduce(
      (best, c) => ((chapterValue(c)! - best) * direction < 0 ? chapterValue(c)! : best),
      chapterValue(beyond[0])!,
    );
    const uploads = beyond.filter((c) => chapterValue(c) === nearest);
    return uploads.find((c) => c.groups.some((g) => current.groups.includes(g))) ?? uploads[0];
  };

  return { prev: pick(-1), next: pick(1) };
}

// "Ch. 12 - Title", "Ch. 12", the title alone, or "Oneshot". The words
// come from the caller so this stays free of next-intl.
export function chapterLabel(c: MdChapter, t: { chapter: (n: string) => string; oneshot: string }): string {
  if (c.number === null) return c.title ?? t.oneshot;
  return c.title ? `${t.chapter(c.number)} - ${c.title}` : t.chapter(c.number);
}
