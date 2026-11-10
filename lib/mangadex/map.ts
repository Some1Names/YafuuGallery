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

// MangaDex synopses are Markdown and usually end with a horizontal rule
// followed by link lists and uploader notes ("---\n**Links:** ..."). We
// show the synopsis as plain text, so keep just the story part.
export function cleanSynopsis(text: string): string {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  const rule = normalized.search(/\n\s*(-{3,}|\*{3,}|_{3,})\s*(\n|$)/);
  const story = rule > 0 ? normalized.slice(0, rule) : normalized;
  return story.replace(/\n{3,}/g, "\n\n").trim();
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
    synopsis: cleanSynopsis(pickLocalized(a.description, locale)),
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

// A chapter's link to an official site, only if it really is a web
// address. It comes from MangaDex (uploader-entered) and ends up in an
// <a href>, so anything else — javascript:, data:, a bare path — is
// dropped rather than trusted.
function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

// A date string only if it parses — one that doesn't would crash the
// date formatter on the title page.
function validDate(value: string | undefined): string | null {
  return value && !Number.isNaN(Date.parse(value)) ? value : null;
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
    volume: a.volume?.trim() || null,
    title: a.title?.trim() || null,
    language,
    groups,
    publishedAt: validDate(a.readableAt) ?? validDate(a.publishAt) ?? "",
    pages: a.pages ?? 0,
    externalUrl: safeExternalUrl(a.externalUrl),
  };
}

// A chapter whose pages we can show: hosted on MangaDex, not a link to
// an official site.
export function isReadable(c: MdChapter): boolean {
  return c.pages > 0 && !c.externalUrl;
}

// ----- Reading order -----
// A chapter "number" from MangaDex is text: usually "12" or "12.5", but
// also "12a", "Extra", or nothing (oneshots). And a few series restart
// from chapter 1 in every volume.

// "12a" -> [12, "a"]; "Extra" -> [Infinity, "Extra"]; none -> null.
function numberParts(number: string | null): [number, string] | null {
  if (number === null) return null;
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(number);
  return match ? [Number(match[1]), match[2].trim()] : [Infinity, number];
}

// True when the same chapter number turns up in two different volumes:
// the numbering restarts per volume, so the volume is part of where a
// chapter sits. (When numbering runs straight through, volumes are
// ignored — groups fill that field in inconsistently, and trusting it
// would split uploads of one chapter apart.)
function numberingRestarts(chapters: MdChapter[]): boolean {
  const volumeOf = new Map<string, string>();
  for (const c of chapters) {
    if (c.number === null || c.volume === null) continue;
    const seen = volumeOf.get(c.number);
    if (seen === undefined) volumeOf.set(c.number, c.volume);
    else if (seen !== c.volume) return true;
  }
  return false;
}

const compareNumbers = (a: number, b: number) => (a === b ? 0 : a < b ? -1 : 1);

function volumeValue(volume: string | null): number {
  const n = volume === null ? NaN : Number.parseFloat(volume);
  return Number.isFinite(n) ? n : Infinity; // no volume: after the numbered ones
}

// Which position in the story a chapter holds. Uploads of the same
// chapter by different groups share one.
function slotKey(c: MdChapter, restarts: boolean): string {
  return `${restarts ? (c.volume ?? "") : ""}|${c.number}`;
}

// Reading order: by chapter number as a number ("9" before "10", "12a"
// right after "12"), by volume first if numbering restarts per volume,
// several uploads of one chapter by date, non-numeric and then
// unnumbered chapters last.
export function sortChapters(chapters: MdChapter[]): MdChapter[] {
  const restarts = numberingRestarts(chapters);
  const byDate = (x: MdChapter, y: MdChapter) => x.publishedAt.localeCompare(y.publishedAt);

  return [...chapters].sort((x, y) => {
    const a = numberParts(x.number);
    const b = numberParts(y.number);
    if (a === null || b === null) return a === b ? byDate(x, y) : a === null ? 1 : -1;
    return (
      (restarts ? compareNumbers(volumeValue(x.volume), volumeValue(y.volume)) : 0) ||
      compareNumbers(a[0], b[0]) ||
      a[1].localeCompare(b[1]) ||
      byDate(x, y)
    );
  });
}

// The chapters before and after `currentId` for the reader's buttons.
// `sorted` is one language's feed as sortChapters returned it. The
// neighbour is the nearest *different* chapter that can be read here;
// when several groups uploaded it, the one the reader is already
// following wins, else the earliest upload.
export function adjacentChapters(
  sorted: MdChapter[],
  currentId: string,
): { prev: MdChapter | null; next: MdChapter | null } {
  const at = sorted.findIndex((c) => c.id === currentId);
  const current = sorted[at];
  if (!current || current.number === null) return { prev: null, next: null };

  const restarts = numberingRestarts(sorted);
  const here = slotKey(current, restarts);

  const pick = (direction: 1 | -1): MdChapter | null => {
    for (let i = at + direction; i >= 0 && i < sorted.length; i += direction) {
      const c = sorted[i];
      if (c.number === null || !isReadable(c)) continue;
      const slot = slotKey(c, restarts);
      if (slot === here) continue;
      // every readable upload of that chapter, earliest first
      const uploads = sorted.filter((u) => u.number !== null && isReadable(u) && slotKey(u, restarts) === slot);
      return uploads.find((u) => u.groups.some((g) => current.groups.includes(g))) ?? uploads[0];
    }
    return null;
  };

  return { prev: pick(-1), next: pick(1) };
}

// "Ch. 12 - Title", "Ch. 12", the title alone, or "Oneshot". The words
// come from the caller so this stays free of next-intl.
export function chapterLabel(c: MdChapter, t: { chapter: (n: string) => string; oneshot: string }): string {
  if (c.number === null) return c.title ?? t.oneshot;
  return c.title ? `${t.chapter(c.number)} - ${c.title}` : t.chapter(c.number);
}

// The chapter number as the site's own chapter rows show it: "#012".
// Whole numbers are padded to three digits ("#012.5", "#007a" pad just
// the whole part); a "number" that isn't one is shown as it is.
export function chapterBadge(c: MdChapter, oneshot: string): string {
  if (c.number === null) return oneshot;
  const match = /^(\d+)(.*)$/.exec(c.number);
  return match ? `#${match[1].padStart(3, "0")}${match[2]}` : `#${c.number}`;
}
