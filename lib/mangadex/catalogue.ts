import catalogue from "./catalogue.json";

// The MangaDex titles Browse lists: well-known ones with chapters that
// can be read on this site, picked ahead of time by
// scripts/build-mangadex-catalogue.ts (see there for the rules and for
// how to refresh the list). Everything else on MangaDex is left out —
// most of it is obscure, and many famous titles have nothing left to
// read but links to an official site.
//
// One list per chapter-language choice, each at most 100 ids: MangaDex
// accepts no more than that in one request.
const MAX_IDS = 100;

export function catalogueIds(lang: "th" | "en" | "all"): string[] {
  return (catalogue[lang] ?? []).slice(0, MAX_IDS);
}
