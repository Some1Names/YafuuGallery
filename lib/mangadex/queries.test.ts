import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PAGES_CACHE_MS,
  forgetChapterPages,
  getChapter,
  getChapterFeed,
  getChapterPages,
  getManga,
  searchManga,
} from "./queries";
import { MangaDexError } from "./types";

const MANGA_ID = "a1c7c817-4e59-43b7-9365-09675a149a6f";
const CHAPTER_ID = "1be064fa-87cf-4b4e-98eb-f301bdbef107";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  forgetChapterPages();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
const urls = () => fetchMock.mock.calls.map(([url]) => String(url));
const kindOf = async (p: Promise<unknown>) => {
  try {
    await p;
  } catch (e) {
    return e instanceof MangaDexError ? e.kind : `not a MangaDexError: ${String(e)}`;
  }
  return "resolved";
};

const manga = (contentRating = "safe") => ({
  result: "ok",
  data: { id: MANGA_ID, type: "manga", attributes: { title: { en: "T" }, contentRating }, relationships: [] },
});
const chapter = (id: string, number: string) => ({
  id,
  type: "chapter",
  attributes: { chapter: number, title: null, translatedLanguage: "en", externalUrl: null, pages: 5, readableAt: "2026-01-01T00:00:00+00:00" },
  relationships: [{ id: MANGA_ID, type: "manga" }],
});
const collection = (data: unknown[], total: number) => ({ result: "ok", data, total, limit: 500, offset: 0 });

describe("getChapterFeed", () => {
  it("pages until the total is reached", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      const offset = Number(new URL(url).searchParams.get("offset"));
      return json(collection([chapter(`c${offset}`, String(offset + 1))], 1200));
    });
    const feed = await getChapterFeed(MANGA_ID, "en");
    expect(urls().map((u) => new URL(u).searchParams.get("offset"))).toEqual(["0", "500", "1000"]);
    expect(feed.map((c) => c.id)).toEqual(["c0", "c500", "c1000"]);
  });

  it("stops after 10 requests", async () => {
    fetchMock.mockImplementation(async () => json(collection([], 99999)));
    await getChapterFeed(MANGA_ID, "en");
    expect(fetchMock).toHaveBeenCalledTimes(10);
  });

  it("lists a chapter once even if MangaDex repeats it across pages", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      const offset = Number(new URL(url).searchParams.get("offset"));
      return json(collection([chapter("same", "1"), chapter(`c${offset}`, "2")], 600));
    });
    expect((await getChapterFeed(MANGA_ID, "en")).map((c) => c.id).sort()).toEqual(["c0", "c500", "same"]);
  });

  it("returns chapters in reading order", async () => {
    fetchMock.mockResolvedValue(json(collection([chapter("b", "10"), chapter("a", "9")], 2)));
    expect((await getChapterFeed(MANGA_ID, "en")).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("rejects a non-uuid as not_found without fetching", async () => {
    expect(await kindOf(getChapterFeed("x", "en"))).toBe("not_found");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("getManga", () => {
  it("rejects a non-uuid as not_found without fetching", async () => {
    expect(await kindOf(getManga("../etc", "en"))).toBe("not_found");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an erotica title as not_found", async () => {
    fetchMock.mockResolvedValue(json(manga("erotica")));
    expect(await kindOf(getManga(MANGA_ID, "en"))).toBe("not_found");
  });

  it("returns a safe title", async () => {
    fetchMock.mockResolvedValue(json(manga("safe")));
    expect((await getManga(MANGA_ID, "en")).title).toBe("T");
  });
});

describe("getChapter", () => {
  it("returns the chapter and its manga id", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/chapter/") ? json({ result: "ok", data: chapter(CHAPTER_ID, "3") }) : json(manga("suggestive")),
    );
    const result = await getChapter(CHAPTER_ID);
    expect(result.mangaId).toBe(MANGA_ID);
    expect(result.chapter.number).toBe("3");
  });

  it("rejects when its manga is pornographic", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/chapter/") ? json({ result: "ok", data: chapter(CHAPTER_ID, "3") }) : json(manga("pornographic")),
    );
    expect(await kindOf(getChapter(CHAPTER_ID))).toBe("not_found");
  });

  it("rejects a chapter in another language", async () => {
    const french = chapter(CHAPTER_ID, "3");
    french.attributes.translatedLanguage = "fr";
    fetchMock.mockResolvedValue(json({ result: "ok", data: french }));
    expect(await kindOf(getChapter(CHAPTER_ID))).toBe("not_found");
  });

  it("rejects a non-uuid without fetching", async () => {
    expect(await kindOf(getChapter("nope"))).toBe("not_found");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("getChapterPages", () => {
  const atHome = (dataSaver: string[]) => ({
    result: "ok",
    baseUrl: "https://x.mangadex.network",
    chapter: { hash: "h", data: [], dataSaver },
  });

  it("builds data-saver URLs in order", async () => {
    fetchMock.mockResolvedValue(json(atHome(["1.jpg", "2.jpg"])));
    expect(await getChapterPages(CHAPTER_ID)).toEqual([
      "https://x.mangadex.network/data-saver/h/1.jpg",
      "https://x.mangadex.network/data-saver/h/2.jpg",
    ]);
  });

  it("never caches the at-home answer", async () => {
    fetchMock.mockResolvedValue(json(atHome(["1.jpg"])));
    await getChapterPages(CHAPTER_ID);
    expect(fetchMock.mock.calls[0][1].cache).toBe("no-store");
  });

  it("asks MangaDex once for repeat requests inside a minute", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => json(atHome(["1.jpg"])));
    const first = await getChapterPages(CHAPTER_ID);
    vi.advanceTimersByTime(PAGES_CACHE_MS - 1);
    expect(await getChapterPages(CHAPTER_ID)).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("asks again once that minute has passed", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => json(atHome(["1.jpg"])));
    await getChapterPages(CHAPTER_ID);
    vi.advanceTimersByTime(PAGES_CACHE_MS);
    await getChapterPages(CHAPTER_ID);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(PAGES_CACHE_MS).toBe(60_000);
  });

  it("keeps each chapter's pages apart", async () => {
    const other = "0f8f4527-a542-40fa-8e62-ed343a4f36b0";
    fetchMock.mockImplementationOnce(async () => json(atHome(["a.jpg"])));
    fetchMock.mockImplementationOnce(async () => json(atHome(["b.jpg"])));
    expect((await getChapterPages(CHAPTER_ID))[0]).toMatch(/a\.jpg$/);
    expect((await getChapterPages(other))[0]).toMatch(/b\.jpg$/);
  });

  it("does not remember a failure", async () => {
    fetchMock.mockImplementationOnce(async () => json(atHome([])));
    fetchMock.mockImplementationOnce(async () => json(atHome(["1.jpg"])));
    expect(await kindOf(getChapterPages(CHAPTER_ID))).toBe("unavailable");
    expect(await getChapterPages(CHAPTER_ID)).toHaveLength(1);
  });

  it("rejects an empty page list as unavailable", async () => {
    fetchMock.mockResolvedValue(json(atHome([])));
    expect(await kindOf(getChapterPages(CHAPTER_ID))).toBe("unavailable");
  });

  it("rejects a malformed answer as unavailable", async () => {
    fetchMock.mockResolvedValue(json({ result: "ok" }));
    expect(await kindOf(getChapterPages(CHAPTER_ID))).toBe("unavailable");
  });

  it("rejects a base URL that is not https", async () => {
    fetchMock.mockResolvedValue(json({ ...atHome(["1.jpg"]), baseUrl: "javascript:alert(1)" }));
    expect(await kindOf(getChapterPages(CHAPTER_ID))).toBe("unavailable");
  });
});

describe("searchManga", () => {
  it("omits title when q is empty and orders by follows", async () => {
    fetchMock.mockResolvedValue(json(collection([], 0)));
    await searchManga({ q: "", lang: "en", page: 1, locale: "en" });
    const params = new URL(urls()[0]).searchParams;
    expect(params.has("title")).toBe(false);
    expect(params.get("order[followedCount]")).toBe("desc");
  });

  it("sends the title and orders by relevance", async () => {
    fetchMock.mockResolvedValue(json(collection([], 0)));
    await searchManga({ q: "one piece", lang: "all", page: 1, locale: "en" });
    const params = new URL(urls()[0]).searchParams;
    expect(params.get("title")).toBe("one piece");
    expect(params.get("order[relevance]")).toBe("desc");
    expect(params.getAll("availableTranslatedLanguage[]")).toEqual(["th", "en"]);
  });

  it("sets hasMore from the total", async () => {
    // a Response body reads once, so build a new one per call
    fetchMock.mockImplementation(async () => json(collection([manga().data], 25)));
    expect((await searchManga({ q: "", lang: "th", page: 1, locale: "th" })).hasMore).toBe(true);
    expect((await searchManga({ q: "", lang: "th", page: 2, locale: "th" })).hasMore).toBe(false);
  });

  it("clamps the page to 400", async () => {
    fetchMock.mockResolvedValue(json(collection([], 0)));
    await searchManga({ q: "", lang: "en", page: 9999, locale: "en" });
    expect(new URL(urls()[0]).searchParams.get("offset")).toBe("9576");
  });
});

describe("content rating", () => {
  it("is exactly safe + suggestive on every list and feed request", async () => {
    fetchMock.mockImplementation(async () => json(collection([], 0)));
    await searchManga({ q: "x", lang: "en", page: 1, locale: "en" });
    await getChapterFeed(MANGA_ID, "th");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const url of urls()) {
      expect(new URL(url).searchParams.getAll("contentRating[]")).toEqual(["safe", "suggestive"]);
    }
  });
});
