import { describe, expect, it } from "vitest";
import { MIN_PUBLISHED_DATE, formatPublishedDate, parsePublishedDate } from "./dates";

const NOW = new Date("2026-09-25T10:00:00Z");

describe("parsePublishedDate", () => {
  it("accepts a real YYYY-MM-DD date, stored as UTC midnight", () => {
    expect(parsePublishedDate("2026-09-01", NOW)?.toISOString()).toBe("2026-09-01T00:00:00.000Z");
    expect(parsePublishedDate(MIN_PUBLISHED_DATE, NOW)).not.toBeNull();
    expect(parsePublishedDate("2024-02-29", NOW)).not.toBeNull(); // leap day
  });

  it("rejects blank and non-date input", () => {
    for (const bad of [undefined, null, "", 0, 1700000000000, "yesterday", "2026-9-1", "01/09/2026", "2026-09-01T00:00:00Z"]) {
      expect(parsePublishedDate(bad, NOW)).toBeNull();
    }
  });

  it("rejects days that don't exist", () => {
    expect(parsePublishedDate("2026-02-30", NOW)).toBeNull();
    expect(parsePublishedDate("2025-02-29", NOW)).toBeNull(); // not a leap year
    expect(parsePublishedDate("2026-13-01", NOW)).toBeNull();
  });

  it("rejects the 1969/1970 'zero date' and anything before the minimum", () => {
    expect(parsePublishedDate("1969-12-31", NOW)).toBeNull();
    expect(parsePublishedDate("1970-01-01", NOW)).toBeNull();
    expect(parsePublishedDate("1989-12-31", NOW)).toBeNull();
  });

  it("allows today and the author's local 'tomorrow', but nothing later", () => {
    expect(parsePublishedDate("2026-09-25", NOW)).not.toBeNull();
    expect(parsePublishedDate("2026-09-26", NOW)).not.toBeNull(); // east of UTC
    expect(parsePublishedDate("2026-09-27", NOW)).toBeNull();
    expect(parsePublishedDate("2030-01-01", NOW)).toBeNull();
  });

  it("round-trips with formatPublishedDate without shifting the day", () => {
    expect(formatPublishedDate(parsePublishedDate("2026-01-01", NOW)!)).toBe("Jan 1, 2026");
  });
});
