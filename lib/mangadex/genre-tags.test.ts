import { describe, expect, it } from "vitest";
import { GENRES } from "@/lib/genres";
import { isUuid } from "./client";
import { GENRE_TAG_IDS } from "./genre-tags";

describe("GENRE_TAG_IDS", () => {
  it("has a MangaDex tag for every genre on the site", () => {
    for (const { slug } of GENRES) expect(isUuid(GENRE_TAG_IDS[slug] ?? ""), slug).toBe(true);
  });

  it("has no genre the site doesn't have", () => {
    expect(Object.keys(GENRE_TAG_IDS).sort()).toEqual(GENRES.map((g) => g.slug).sort());
  });

  it("gives each genre its own tag", () => {
    const ids = Object.values(GENRE_TAG_IDS);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
