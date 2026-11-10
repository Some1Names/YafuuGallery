import { describe, expect, it } from "vitest";
import { earlierPage, pagesToFetch, toMdLanguage } from "./browse-params";

describe("pagesToFetch", () => {
  it("is every page up to the current one", () => {
    expect(pagesToFetch(1)).toEqual([1]);
    expect(pagesToFetch(3)).toEqual([1, 2, 3]);
  });

  it("is only the last five once past page 5", () => {
    expect(pagesToFetch(8)).toEqual([4, 5, 6, 7, 8]);
  });
});

describe("toMdLanguage", () => {
  it("keeps th and en, anything else is en", () => {
    expect(toMdLanguage("th")).toBe("th");
    expect(toMdLanguage("en")).toBe("en");
    expect(toMdLanguage("ja")).toBe("en");
    expect(toMdLanguage(undefined)).toBe("en");
  });
});

describe("earlierPage", () => {
  it("is null while every page so far is shown", () => {
    expect(earlierPage(1)).toBeNull();
    expect(earlierPage(5)).toBeNull();
  });

  it("is the page just before the ones shown", () => {
    expect(earlierPage(6)).toBe(1);
    expect(earlierPage(8)).toBe(3);
  });
});
