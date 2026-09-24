import { describe, expect, it } from "vitest";
import { formatChapterBadge, getChapterDisplayNumbers } from "./chapter-number";

const ch = (id: string, chapter_number: number, chapter_is_ex = false) => ({ id, chapter_number, chapter_is_ex });

describe("getChapterDisplayNumbers", () => {
  it("numbers chapters 1, 2, 3 by position, whatever order they arrive in", () => {
    const numbers = getChapterDisplayNumbers([ch("c", 2), ch("a", 0), ch("b", 1)]);
    expect(Object.fromEntries(numbers)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("skips ex chapters without shifting the ones around them", () => {
    const numbers = getChapterDisplayNumbers([ch("a", 0), ch("ex", 1, true), ch("b", 2)]);
    expect(numbers.get("a")).toBe(1);
    expect(numbers.get("b")).toBe(2);
    expect(numbers.has("ex")).toBe(false);
  });

  it("handles a manga with no chapters", () => {
    expect(getChapterDisplayNumbers([]).size).toBe(0);
  });
});

describe("formatChapterBadge", () => {
  it("pads to three digits", () => {
    expect(formatChapterBadge(false, 4)).toBe("#004");
    expect(formatChapterBadge(false, 123)).toBe("#123");
  });

  it("labels ex chapters", () => {
    expect(formatChapterBadge(true, undefined)).toBe("ex");
  });
});
