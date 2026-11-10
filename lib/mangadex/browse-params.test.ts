import { describe, expect, it } from "vitest";
import { browseHref, pagesToFetch, parseBrowseParams, toMdLanguage } from "./browse-params";

describe("parseBrowseParams", () => {
  it("defaults lang to the interface locale, page to 1, q to ''", () => {
    expect(parseBrowseParams({}, "th")).toEqual({ q: "", lang: "th", page: 1 });
    expect(parseBrowseParams({}, "en")).toEqual({ q: "", lang: "en", page: 1 });
  });

  it("accepts lang all, th and en", () => {
    expect(parseBrowseParams({ lang: "all" }, "th").lang).toBe("all");
    expect(parseBrowseParams({ lang: "en" }, "th").lang).toBe("en");
    expect(parseBrowseParams({ lang: "th" }, "en").lang).toBe("th");
  });

  it("ignores any other lang", () => {
    expect(parseBrowseParams({ lang: "fr" }, "th").lang).toBe("th");
    expect(parseBrowseParams({ lang: "" }, "en").lang).toBe("en");
  });

  it("takes the first value of repeated params", () => {
    expect(parseBrowseParams({ q: ["a", "b"], lang: ["en", "th"], page: ["2", "3"] }, "th")).toEqual({
      q: "a",
      lang: "en",
      page: 2,
    });
  });

  it("clamps the page to 1..400", () => {
    for (const bad of ["0", "-3", "abc", "", "1.5x"]) {
      expect(parseBrowseParams({ page: bad }, "en").page).toBe(1);
    }
    expect(parseBrowseParams({ page: "9999" }, "en").page).toBe(400);
    expect(parseBrowseParams({ page: "7" }, "en").page).toBe(7);
  });

  it("cleans q", () => {
    expect(parseBrowseParams({ q: "  a   b " }, "en").q).toBe("a b");
  });
});

describe("browseHref", () => {
  it("omits an empty q and page 1, always keeps lang", () => {
    expect(browseHref({ lang: "en" })).toBe("/browse?lang=en");
    expect(browseHref({ q: "", lang: "th", page: 1 })).toBe("/browse?lang=th");
  });

  it("encodes q and adds later pages", () => {
    expect(browseHref({ q: "a&b", lang: "all", page: 2 })).toBe("/browse?q=a%26b&lang=all&page=2");
  });

  it("is plain /browse with nothing set", () => {
    expect(browseHref({})).toBe("/browse");
  });
});

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
