import { describe, expect, it } from "vitest";
import { CHAPTERS_PER_PAGE, pageCount, pageSlice, pagerItems } from "./chapter-pages";

const list = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe("CHAPTERS_PER_PAGE", () => {
  it("is 20", () => {
    expect(CHAPTERS_PER_PAGE).toBe(20);
  });
});

describe("pageCount", () => {
  it("is 1 for an empty or short list", () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(20)).toBe(1);
  });

  it("rounds up", () => {
    expect(pageCount(21)).toBe(2);
    expect(pageCount(82)).toBe(5);
  });
});

describe("pageSlice", () => {
  it("is the first 20 on page 1", () => {
    expect(pageSlice(list(82), 1)).toEqual(list(20));
  });

  it("is what's left on the last page", () => {
    expect(pageSlice(list(82), 5)).toEqual([81, 82]);
  });

  it("treats a page outside the range as the nearest real one", () => {
    expect(pageSlice(list(82), 0)).toEqual(list(20));
    expect(pageSlice(list(82), 99)).toEqual([81, 82]);
  });

  it("is everything when the list fits on one page", () => {
    expect(pageSlice(list(7), 1)).toEqual(list(7));
  });
});

describe("pagerItems", () => {
  it("lists every page when there are few", () => {
    expect(pagerItems(1, 1)).toEqual([1]);
    expect(pagerItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("keeps the first, the last and the neighbours, with gaps between", () => {
    expect(pagerItems(10, 20)).toEqual([1, "gap", 9, 10, 11, "gap", 20]);
  });

  it("has one gap near the start", () => {
    expect(pagerItems(1, 20)).toEqual([1, 2, 3, "gap", 20]);
    expect(pagerItems(3, 20)).toEqual([1, 2, 3, 4, "gap", 20]);
  });

  it("has one gap near the end", () => {
    expect(pagerItems(20, 20)).toEqual([1, "gap", 18, 19, 20]);
  });

  it("never shows a gap that would hide a single page", () => {
    // 1 … 3 would hide only page 2 — show it instead
    expect(pagerItems(4, 20)).toEqual([1, 2, 3, 4, 5, "gap", 20]);
    expect(pagerItems(17, 20)).toEqual([1, "gap", 16, 17, 18, 19, 20]);
  });
});
