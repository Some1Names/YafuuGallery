import { describe, expect, it } from "vitest";
import { isLocale, pickLocale } from "./locales";

describe("pickLocale", () => {
  it("picks Thai when the browser prefers it", () => {
    expect(pickLocale("th-TH,th;q=0.9,en;q=0.8")).toBe("th");
    expect(pickLocale("th")).toBe("th");
  });

  it("picks English when the browser prefers it or nothing supported is listed", () => {
    expect(pickLocale("en-US,en;q=0.9,th;q=0.5")).toBe("en");
    expect(pickLocale("ja-JP,ja;q=0.9")).toBe("en");
    expect(pickLocale("")).toBe("en");
    expect(pickLocale(null)).toBe("en");
  });

  it("follows q-values, not just order, and skips q=0", () => {
    expect(pickLocale("en;q=0.4,th;q=0.8")).toBe("th");
    expect(pickLocale("th;q=0,en")).toBe("en");
    expect(pickLocale("fr,th;q=0.7,en;q=0.6")).toBe("th");
  });
});

describe("isLocale", () => {
  it("accepts only the interface languages", () => {
    expect(isLocale("th")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ja")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
