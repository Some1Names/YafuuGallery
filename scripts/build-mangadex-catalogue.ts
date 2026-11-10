// Builds lib/mangadex/catalogue.json — the MangaDex titles Browse lists.
//
//   bun scripts/build-mangadex-catalogue.ts
//
// Browse doesn't show all of MangaDex: only well-known titles that can
// actually be read on this site. MangaDex can't filter a list by either
// of those, and checking title by title while a page renders would take
// dozens of requests, so the checking is done here, ahead of time, and
// the result is committed. Re-run it now and then (chapters get taken
// down, new series get popular), check the diff, commit.
//
// For Thai and for English: walk MangaDex's titles from most followed
// down, keep each one with at least MIN_CHAPTERS chapters hosted on
// MangaDex in that language (chapters that only link to an official
// site don't count — there is nothing to read here), stop at
// PER_LANGUAGE. "all" is the most followed PER_LANGUAGE of the two lists
// together.
//
// Takes a few minutes: it stays well under MangaDex's limit of about 5
// requests a second.

import { writeFileSync } from "node:fs";
import { mdFetch } from "../lib/mangadex/client";
import { MD_CONTENT_RATINGS, type MdLanguage, type RawCollection, type RawManga } from "../lib/mangadex/types";

// MangaDex accepts at most 100 ids in one request, and Browse asks for
// a list in one request.
const PER_LANGUAGE = 100;
// A famous title with one or two chapters left up is a dead end.
const MIN_CHAPTERS = 5;
const PAUSE_MS = 250;
const PAGE = 100;
// MangaDex refuses offset + limit above 10,000.
const MAX_OFFSET = 9900;

const OUT = new URL("../lib/mangadex/catalogue.json", import.meta.url);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function readableChapters(mangaId: string, language: MdLanguage): Promise<number> {
  const res = await mdFetch<RawCollection<unknown>>("/chapter", {
    manga: mangaId,
    translatedLanguage: [language],
    contentRating: MD_CONTENT_RATINGS,
    includeExternalUrl: "0",
    includeEmptyPages: "0",
    limit: 1,
  });
  return res.total ?? 0;
}

async function build(language: MdLanguage): Promise<string[]> {
  const kept: string[] = [];
  let checked = 0;

  for (let offset = 0; offset <= MAX_OFFSET && kept.length < PER_LANGUAGE; offset += PAGE) {
    const page = await mdFetch<RawCollection<RawManga>>("/manga", {
      limit: PAGE,
      offset,
      contentRating: MD_CONTENT_RATINGS,
      availableTranslatedLanguage: [language],
      hasAvailableChapters: "true",
      order: { followedCount: "desc" },
    });
    await sleep(PAUSE_MS);

    for (const manga of page.data ?? []) {
      if (kept.length >= PER_LANGUAGE) break;
      checked += 1;
      if ((await readableChapters(manga.id, language)) >= MIN_CHAPTERS) kept.push(manga.id);
      await sleep(PAUSE_MS);
    }
    console.log(`${language}: checked ${checked}, kept ${kept.length}`);
    if (offset + PAGE >= (page.total ?? 0)) break;
  }

  return kept;
}

async function follows(ids: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  for (let i = 0; i < ids.length; i += 100) {
    const res = await mdFetch<{ statistics: Record<string, { follows?: number }> }>("/statistics/manga", {
      manga: ids.slice(i, i + 100),
    });
    for (const [id, stats] of Object.entries(res.statistics ?? {})) counts.set(id, stats.follows ?? 0);
    await sleep(PAUSE_MS);
  }
  return counts;
}

const th = await build("th");
const en = await build("en");

const union = [...new Set([...th, ...en])];
const counts = await follows(union);
const all = [...union].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)).slice(0, PER_LANGUAGE);

writeFileSync(
  OUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), minChapters: MIN_CHAPTERS, th, en, all }, null, 2) + "\n",
);
console.log(`wrote ${th.length} th, ${en.length} en, ${all.length} all`);
