import { describe, expect, it } from "vitest";
import { isUuid } from "./client";
import { catalogueIds } from "./catalogue";

// The catalogue file is generated (scripts/build-mangadex-catalogue.ts);
// these check the shape the rest of the code relies on.
describe("catalogueIds", () => {
  it.each(["th", "en", "all"] as const)("%s: at most 100 ids, each a MangaDex id, none twice", (lang) => {
    const ids = catalogueIds(lang);
    expect(ids.length).toBeLessThanOrEqual(100);
    expect(ids.every(isUuid)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has titles to show", () => {
    expect(catalogueIds("en").length).toBeGreaterThan(0);
    expect(catalogueIds("all").length).toBeGreaterThan(0);
  });

  it("'all' only holds titles from the two language lists", () => {
    const known = new Set([...catalogueIds("th"), ...catalogueIds("en")]);
    expect(catalogueIds("all").every((id) => known.has(id))).toBe(true);
  });
});
