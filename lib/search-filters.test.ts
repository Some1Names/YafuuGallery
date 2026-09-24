import { describe, expect, it } from "vitest";
import { parseSearchFilters, searchHref } from "./search-filters";
import { parseGenres } from "./genres";
import { parsePageCount, splitExtraRow } from "./pagination";

describe("parseSearchFilters", () => {
  it("reads a full set of filters", () => {
    expect(parseSearchFilters({ q: "  dome ", genre: "drama", status: "completed", sort: "views" })).toEqual({
      q: "dome",
      genre: "drama",
      status: "completed",
      sort: "views",
    });
  });

  it("drops unknown values instead of producing an empty page", () => {
    expect(parseSearchFilters({ genre: "not-a-genre", status: "paused", sort: "random" })).toEqual({
      q: "",
      genre: null,
      status: null,
      sort: "updated",
    });
  });

  it("takes the first value of a repeated param", () => {
    expect(parseSearchFilters({ genre: ["action", "drama"] }).genre).toBe("action");
  });
});

describe("searchHref", () => {
  it("leaves out defaults to keep links short", () => {
    expect(searchHref({})).toBe("/search");
    expect(searchHref({ q: " ", sort: "updated" })).toBe("/search");
    expect(searchHref({ genre: "action" })).toBe("/search?genre=action");
  });

  it("round-trips through parseSearchFilters", () => {
    const filters = { q: "iron tide", genre: "sci-fi", status: "ongoing", sort: "title" } as const;
    const href = searchHref(filters, 3);
    const params = Object.fromEntries(new URLSearchParams(href.split("?")[1]));
    expect(params.page).toBe("3");
    expect(parseSearchFilters(params)).toEqual(filters);
  });
});

describe("parseGenres", () => {
  it("keeps known genres only, deduped, in the list's own order", () => {
    expect(parseGenres(["romance", "action", "bogus", "action"])).toEqual(["action", "romance"]);
  });

  it("treats anything that isn't an array as no genres", () => {
    expect(parseGenres("action")).toEqual([]);
    expect(parseGenres(undefined)).toEqual([]);
  });
});

describe("pagination", () => {
  it("parses ?page= safely", () => {
    expect(parsePageCount(undefined)).toBe(1);
    expect(parsePageCount("3")).toBe(3);
    expect(parsePageCount("0")).toBe(1);
    expect(parsePageCount("-2")).toBe(1);
    expect(parsePageCount("abc")).toBe(1);
    expect(parsePageCount("999999")).toBe(50);
    expect(parsePageCount(["2", "9"])).toBe(2);
  });

  it("uses the extra row only to learn there's more", () => {
    expect(splitExtraRow([1, 2, 3], 2)).toEqual({ items: [1, 2], hasMore: true });
    expect(splitExtraRow([1, 2], 2)).toEqual({ items: [1, 2], hasMore: false });
  });
});
