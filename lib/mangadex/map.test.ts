import { describe, expect, it } from "vitest";
import {
  adjacentChapters,
  chapterBadge,
  chapterLabel,
  cleanSynopsis,
  coverPath,
  isReadable,
  pickLocalized,
  sortChapters,
  toChapter,
  toManga,
  toMangaSummary,
} from "./map";
import type { MdChapter, RawChapter, RawCollection, RawEntity, RawManga } from "./types";
import mangaListJson from "./__fixtures__/manga-list.json";
import mangaDetailJson from "./__fixtures__/manga-detail.json";
import feedJson from "./__fixtures__/feed.json";

const mangaList = mangaListJson as unknown as RawCollection<RawManga>;
const mangaDetail = mangaDetailJson as unknown as RawEntity<RawManga>;
const feed = feedJson as unknown as RawCollection<RawChapter>;

function rawManga(attributes: Partial<RawManga["attributes"]>, relationships: RawManga["relationships"] = []): RawManga {
  return { id: "m1", type: "manga", attributes: { title: { en: "T" }, ...attributes }, relationships };
}

function rawChapter(attributes: Partial<RawChapter["attributes"]>, relationships: RawChapter["relationships"] = []): RawChapter {
  return {
    id: "c1",
    type: "chapter",
    attributes: {
      chapter: "1",
      volume: null,
      title: null,
      translatedLanguage: "en",
      externalUrl: null,
      pages: 10,
      readableAt: "2026-01-01T00:00:00+00:00",
      ...attributes,
    },
    relationships,
  };
}

let seq = 0;
function ch(partial: Partial<MdChapter>): MdChapter {
  seq += 1;
  return {
    id: `c${seq}`,
    number: "1",
    volume: null,
    title: null,
    language: "en",
    groups: [],
    publishedAt: `2026-01-01T00:00:${String(seq % 60).padStart(2, "0")}+00:00`,
    pages: 10,
    externalUrl: null,
    ...partial,
  };
}

describe("pickLocalized", () => {
  it("prefers the locale", () => {
    expect(pickLocalized({ en: "A", th: "ก" }, "th")).toBe("ก");
  });

  it("falls back to en", () => {
    expect(pickLocalized({ en: "A", ja: "あ" }, "th")).toBe("A");
  });

  it("looks in alt titles for the locale before falling back", () => {
    expect(pickLocalized({ en: "A" }, "th", [{ ja: "あ" }, { th: "ก" }])).toBe("ก");
  });

  it("uses an English alt title when the main title has no English", () => {
    expect(pickLocalized({ "ja-ro": "Wan Pisu" }, "th", [{ en: "One Piece" }])).toBe("One Piece");
  });

  it("falls back to the first value when neither exists", () => {
    expect(pickLocalized({ "ja-ro": "Wan" }, "th")).toBe("Wan");
  });

  it("returns '' for undefined or empty", () => {
    expect(pickLocalized(undefined, "en")).toBe("");
    expect(pickLocalized({}, "en")).toBe("");
  });
});

describe("coverPath", () => {
  const rel = [{ id: "c", type: "cover_art", attributes: { fileName: "abc.png" } }];

  it("builds our route path from the cover_art relationship", () => {
    expect(coverPath("m1", rel, 512)).toBe("/api/mangadex/cover/m1/abc.png?size=512");
  });

  it("defaults to size 256", () => {
    expect(coverPath("m1", rel)).toBe("/api/mangadex/cover/m1/abc.png?size=256");
  });

  it("is null with no cover_art", () => {
    expect(coverPath("m1", [{ id: "a", type: "author" }])).toBeNull();
  });

  it("is null when cover_art has no fileName attribute", () => {
    expect(coverPath("m1", [{ id: "c", type: "cover_art" }])).toBeNull();
  });
});

describe("toMangaSummary", () => {
  it("maps a real search result: id, title, cover path, status", () => {
    const raw = mangaList.data[0];
    const fileName = raw.relationships.find((r) => r.type === "cover_art")?.attributes?.fileName;
    const summary = toMangaSummary(raw, "en");
    expect(summary.id).toBe(raw.id);
    expect(summary.title.length).toBeGreaterThan(0);
    expect(summary.coverUrl).toBe(`/api/mangadex/cover/${raw.id}/${fileName}?size=256`);
    expect(summary.status).toBe("ongoing");
  });

  it("keeps only th/en languages, th first", () => {
    const raw = rawManga({ availableTranslatedLanguages: ["en", "fr", null, "th"] });
    expect(toMangaSummary(raw, "en").languages).toEqual(["th", "en"]);
  });

  it("has no languages when the field is missing", () => {
    expect(toMangaSummary(rawManga({}), "en").languages).toEqual([]);
  });

  it("treats an unknown status as ongoing", () => {
    expect(toMangaSummary(rawManga({ status: "weird" }), "en").status).toBe("ongoing");
    expect(toMangaSummary(rawManga({ status: "hiatus" }), "en").status).toBe("hiatus");
  });
});

describe("toManga", () => {
  const tag = (name: string, group: string) => ({ id: name, attributes: { name: { en: name }, group } });

  it("maps a real manga: synopsis, genres, url", () => {
    const manga = toManga(mangaDetail.data, "en");
    expect(manga.synopsis.length).toBeGreaterThan(0);
    expect(manga.genres).toContain("Adventure");
    expect(manga.genres).not.toContain("Award Winning");
    expect(manga.mangadexUrl).toBe(`https://mangadex.org/title/${mangaDetail.data.id}`);
    expect(manga.direction).toBe("rtl");
    expect(manga.longStrip).toBe(false);
  });

  it("reads the author's name from a real manga", () => {
    expect(toManga(mangaDetail.data, "en").authors.length).toBeGreaterThan(0);
  });

  it("genres are tag names in the genre group only", () => {
    const raw = rawManga({ tags: [tag("Action", "genre"), tag("Monsters", "theme"), tag("Gore", "content")] });
    expect(toManga(raw, "en").genres).toEqual(["Action"]);
  });

  it("longStrip is true when a 'Long Strip' tag exists", () => {
    expect(toManga(rawManga({ tags: [tag("Long Strip", "format")] }), "en").longStrip).toBe(true);
  });

  it("direction is rtl for Japanese originals, ltr otherwise", () => {
    expect(toManga(rawManga({ originalLanguage: "ja" }), "en").direction).toBe("rtl");
    expect(toManga(rawManga({ originalLanguage: "ko" }), "en").direction).toBe("ltr");
    expect(toManga(rawManga({}), "en").direction).toBe("rtl");
  });

  it("authors come from author relationships, de-duplicated", () => {
    const raw = rawManga({}, [
      { id: "a1", type: "author", attributes: { name: "Oda" } },
      { id: "a1", type: "artist", attributes: { name: "Oda" } },
      { id: "a2", type: "author", attributes: { name: "Second" } },
      { id: "a3", type: "author" },
    ]);
    expect(toManga(raw, "en").authors).toEqual(["Oda", "Second"]);
  });

  it("a manga whose only title is ja-ro still gets a title", () => {
    expect(toManga(rawManga({ title: { "ja-ro": "Wan Pisu" } }), "th").title).toBe("Wan Pisu");
  });

  it("the synopsis is '' when there is no description", () => {
    expect(toManga(rawManga({}), "en").synopsis).toBe("");
  });
});

describe("toChapter", () => {
  it("maps a real feed chapter", () => {
    const raw = feed.data[0];
    const chapter = toChapter(raw);
    expect(chapter).not.toBeNull();
    expect(chapter?.id).toBe(raw.id);
    expect(chapter?.number).toBe(raw.attributes.chapter);
    expect(chapter?.language).toBe("en");
    expect(chapter?.externalUrl).toBe(raw.attributes.externalUrl);
    expect(chapter?.groups).toEqual(["MangaPlus"]);
  });

  it("maps number, title, pages and date", () => {
    const chapter = toChapter(rawChapter({ chapter: "12.5", title: "Extra", pages: 7 }));
    expect(chapter).toMatchObject({ number: "12.5", title: "Extra", pages: 7, publishedAt: "2026-01-01T00:00:00+00:00" });
  });

  it("keeps the volume", () => {
    expect(toChapter(rawChapter({ volume: "3" }))?.volume).toBe("3");
    expect(toChapter(rawChapter({ volume: "" }))?.volume).toBeNull();
  });

  it("has no date when MangaDex sends one that isn't a date", () => {
    expect(toChapter(rawChapter({ readableAt: "soon", publishAt: undefined }))?.publishedAt).toBe("");
    expect(toChapter(rawChapter({ readableAt: undefined, publishAt: undefined }))?.publishedAt).toBe("");
  });

  it("treats an empty title or number as none", () => {
    expect(toChapter(rawChapter({ chapter: "", title: "  " }))).toMatchObject({ number: null, title: null });
  });

  it("keeps an http(s) external link", () => {
    expect(toChapter(rawChapter({ externalUrl: "https://mangaplus.shueisha.co.jp/viewer/1", pages: 0 }))?.externalUrl).toBe(
      "https://mangaplus.shueisha.co.jp/viewer/1",
    );
  });

  it.each(["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "//evil.example/x", "not a url", " "])(
    "drops an external link that is not http(s): %j",
    (externalUrl) => {
      expect(toChapter(rawChapter({ externalUrl, pages: 0 }))?.externalUrl).toBeNull();
    },
  );

  it("returns null when the chapter is unavailable", () => {
    expect(toChapter(rawChapter({ isUnavailable: true }))).toBeNull();
  });

  it("returns null for a language other than th/en", () => {
    expect(toChapter(rawChapter({ translatedLanguage: "fr" }))).toBeNull();
  });

  it("groups is [] when no scanlation_group has attributes", () => {
    expect(toChapter(rawChapter({}, [{ id: "g", type: "scanlation_group" }]))?.groups).toEqual([]);
  });
});

describe("isReadable", () => {
  it("needs pages and no external url", () => {
    expect(isReadable(ch({}))).toBe(true);
    expect(isReadable(ch({ pages: 0 }))).toBe(false);
    expect(isReadable(ch({ externalUrl: "https://example.test" }))).toBe(false);
  });
});

describe("sortChapters", () => {
  const numbers = (list: MdChapter[]) => sortChapters(list).map((c) => c.number);

  it("orders numerically, not as text", () => {
    expect(numbers([ch({ number: "10" }), ch({ number: "9" }), ch({ number: "13" }), ch({ number: "12.5" }), ch({ number: "12" })])).toEqual([
      "9",
      "10",
      "12",
      "12.5",
      "13",
    ]);
  });

  it("puts chapters without a number last", () => {
    expect(numbers([ch({ number: null }), ch({ number: "2" }), ch({ number: "1" })])).toEqual(["1", "2", null]);
  });

  it("orders uploads of the same number by date", () => {
    const late = ch({ number: "1", publishedAt: "2026-02-01T00:00:00+00:00" });
    const early = ch({ number: "1", publishedAt: "2026-01-01T00:00:00+00:00" });
    expect(sortChapters([late, early]).map((c) => c.id)).toEqual([early.id, late.id]);
  });

  it("puts lettered chapters right after their number", () => {
    expect(numbers([ch({ number: "13" }), ch({ number: "12b" }), ch({ number: "12" }), ch({ number: "12a" })])).toEqual([
      "12",
      "12a",
      "12b",
      "13",
    ]);
  });

  it("puts chapters whose number isn't a number after the numbered ones", () => {
    expect(numbers([ch({ number: "Extra" }), ch({ number: "2" }), ch({ number: null })])).toEqual(["2", "Extra", null]);
  });

  it("orders by volume first when numbering restarts every volume", () => {
    const list = [
      ch({ volume: "2", number: "1" }),
      ch({ volume: "1", number: "2" }),
      ch({ volume: "2", number: "2" }),
      ch({ volume: "1", number: "1" }),
    ];
    expect(sortChapters(list).map((c) => `${c.volume}-${c.number}`)).toEqual(["1-1", "1-2", "2-1", "2-2"]);
  });

  it("ignores volumes when numbering runs straight through", () => {
    // one group filled in the volume, another left it blank: same series
    const list = [ch({ volume: "2", number: "11" }), ch({ volume: null, number: "10" }), ch({ volume: "1", number: "9" })];
    expect(numbers(list)).toEqual(["9", "10", "11"]);
  });

  it("does not change the list it was given", () => {
    const list = [ch({ number: "2" }), ch({ number: "1" })];
    sortChapters(list);
    expect(list.map((c) => c.number)).toEqual(["2", "1"]);
  });
});

describe("adjacentChapters", () => {
  const c1 = ch({ number: "1", groups: ["A"] });
  const c2a = ch({ number: "2", groups: ["A"] });
  const c2b = ch({ number: "2", groups: ["B"] });
  const c3x = ch({ number: "3", groups: ["B"], externalUrl: "https://example.test", pages: 0 });
  const c4 = ch({ number: "4", groups: ["A"] });
  const oneshot = ch({ number: null });
  const list = sortChapters([c1, c2a, c2b, c3x, c4, oneshot]);

  it("prefers the same group for the next chapter", () => {
    expect(adjacentChapters(list, c1.id).next?.id).toBe(c2a.id);
  });

  it("skips external chapters and other uploads of the same number", () => {
    expect(adjacentChapters(list, c2b.id).next?.id).toBe(c4.id);
  });

  it("prefers the same group for the previous chapter", () => {
    expect(adjacentChapters(list, c4.id).prev?.id).toBe(c2a.id);
  });

  it("falls back to the earliest upload when no group matches", () => {
    const solo = ch({ number: "5", groups: ["Z"] });
    expect(adjacentChapters(sortChapters([c2a, c2b, solo]), solo.id).prev?.id).toBe(c2a.id);
  });

  it("has no prev before the first or next after the last", () => {
    expect(adjacentChapters(list, c1.id).prev).toBeNull();
    expect(adjacentChapters(list, c4.id).next).toBeNull();
  });

  it("treats 12a as its own chapter between 12 and 13", () => {
    const a = ch({ number: "12" });
    const b = ch({ number: "12a" });
    const c = ch({ number: "13" });
    const sorted = sortChapters([c, a, b]);
    expect(adjacentChapters(sorted, a.id).next?.id).toBe(b.id);
    expect(adjacentChapters(sorted, c.id).prev?.id).toBe(b.id);
  });

  it("walks volume by volume when numbering restarts", () => {
    const v1c1 = ch({ volume: "1", number: "1" });
    const v1c2 = ch({ volume: "1", number: "2" });
    const v2c1 = ch({ volume: "2", number: "1" });
    const sorted = sortChapters([v2c1, v1c2, v1c1]);
    expect(adjacentChapters(sorted, v1c1.id).next?.id).toBe(v1c2.id);
    expect(adjacentChapters(sorted, v1c2.id).next?.id).toBe(v2c1.id);
    expect(adjacentChapters(sorted, v2c1.id).prev?.id).toBe(v1c2.id);
  });

  it("gives nothing for an unknown id", () => {
    expect(adjacentChapters(list, "nope")).toEqual({ prev: null, next: null });
  });

  it("gives nothing for a chapter without a number", () => {
    expect(adjacentChapters(list, oneshot.id)).toEqual({ prev: null, next: null });
  });
});

describe("chapterLabel", () => {
  const t = { chapter: (n: string) => `Ch. ${n}`, oneshot: "Oneshot" };

  it("joins number and title", () => {
    expect(chapterLabel(ch({ number: "12", title: "Dawn" }), t)).toBe("Ch. 12 - Dawn");
  });

  it("is the number alone without a title", () => {
    expect(chapterLabel(ch({ number: "12" }), t)).toBe("Ch. 12");
  });

  it("is 'Oneshot' with neither", () => {
    expect(chapterLabel(ch({ number: null }), t)).toBe("Oneshot");
  });

  it("is the title alone when there is no number", () => {
    expect(chapterLabel(ch({ number: null, title: "Special" }), t)).toBe("Special");
  });
});

describe("cleanSynopsis", () => {
  it("drops everything from the first horizontal rule (link lists, notes)", () => {
    expect(cleanSynopsis("A story.\n\nMore.\n\n---\n**Links:**\n- [x](y)")).toBe("A story.\n\nMore.");
  });

  it("keeps text with no rule, trimmed", () => {
    expect(cleanSynopsis("  Just a story.\n")).toBe("Just a story.");
  });

  it("keeps the whole text when the rule is the first line", () => {
    expect(cleanSynopsis("---\nOnly this")).toBe("---\nOnly this");
  });

  it("collapses three or more line breaks to a paragraph break", () => {
    expect(cleanSynopsis("A\n\n\n\nB")).toBe("A\n\nB");
  });

  it("turns Windows line endings into plain ones", () => {
    expect(cleanSynopsis("A\r\n\r\nB")).toBe("A\n\nB");
  });
});

describe("chapterBadge", () => {
  it("pads whole numbers to three digits, like the site's own chapters", () => {
    expect(chapterBadge(ch({ number: "1" }), "Oneshot")).toBe("#001");
    expect(chapterBadge(ch({ number: "12" }), "Oneshot")).toBe("#012");
    expect(chapterBadge(ch({ number: "1198" }), "Oneshot")).toBe("#1198");
  });

  it("pads only the whole part of a decimal or lettered number", () => {
    expect(chapterBadge(ch({ number: "12.5" }), "Oneshot")).toBe("#012.5");
    expect(chapterBadge(ch({ number: "7a" }), "Oneshot")).toBe("#007a");
  });

  it("shows a number that isn't a number as it is", () => {
    expect(chapterBadge(ch({ number: "Extra" }), "Oneshot")).toBe("#Extra");
  });

  it("is the oneshot word without a number", () => {
    expect(chapterBadge(ch({ number: null }), "Oneshot")).toBe("Oneshot");
  });
});
