import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildMdUrl, cleanSearchText, isUuid, mdFetch } from "./client";
import { MangaDexError } from "./types";

describe("buildMdUrl", () => {
  it("encodes array params with %5B%5D", () => {
    expect(buildMdUrl("/manga", { contentRating: ["safe", "suggestive"], limit: 24 })).toBe(
      "https://api.mangadex.org/manga?contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&limit=24",
    );
  });

  it("encodes object params as key%5Bsub%5D", () => {
    expect(buildMdUrl("/manga", { order: { followedCount: "desc" } })).toBe(
      "https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc",
    );
  });

  it("skips undefined and encodes special characters", () => {
    expect(buildMdUrl("/manga", { title: "a&b #1 [x] มังงะ", offset: undefined })).toBe(
      "https://api.mangadex.org/manga?title=" + encodeURIComponent("a&b #1 [x] มังงะ"),
    );
  });

  it("has no trailing ? without params", () => {
    expect(buildMdUrl("/manga/abc")).toBe("https://api.mangadex.org/manga/abc");
    expect(buildMdUrl("/manga/abc", {})).toBe("https://api.mangadex.org/manga/abc");
  });
});

describe("cleanSearchText", () => {
  it("trims and collapses whitespace", () => {
    expect(cleanSearchText("  one   piece ")).toBe("one piece");
  });

  it("caps at 200 characters", () => {
    expect(cleanSearchText("x".repeat(500))).toHaveLength(200);
  });

  it("turns undefined into an empty string", () => {
    expect(cleanSearchText(undefined)).toBe("");
  });
});

describe("isUuid", () => {
  it("accepts a uuid", () => {
    expect(isUuid("a1c7c817-4e59-43b7-9365-09675a149a6f")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isUuid("../etc")).toBe(false);
    expect(isUuid("a1c7c817-4e59-43b7-9365-09675a149a6f/x")).toBe(false);
    expect(isUuid("")).toBe(false);
  });
});

describe("mdFetch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const respond = (body: string, status = 200) => fetchMock.mockResolvedValue(new Response(body, { status }));
  const kindOf = async (p: Promise<unknown>) => {
    try {
      await p;
    } catch (e) {
      return e instanceof MangaDexError ? e.kind : `not a MangaDexError: ${String(e)}`;
    }
    return "resolved";
  };

  it("returns the parsed body", async () => {
    respond('{"result":"ok","data":[1]}');
    expect(await mdFetch("/manga")).toEqual({ result: "ok", data: [1] });
  });

  it("sends the honest User-Agent and next.revalidate", async () => {
    respond('{"result":"ok"}');
    await mdFetch("/manga", {}, { revalidate: 300 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.mangadex.org/manga");
    expect(init.headers["User-Agent"]).toMatch(/^YafuuGallery\/1\.0 \(\+https?:\/\//);
    expect(init.next).toEqual({ revalidate: 300 });
    expect(init.cache).toBeUndefined();
  });

  it("uses cache: 'no-store' when revalidate is false or omitted", async () => {
    respond('{"result":"ok"}');
    await mdFetch("/manga", {}, { revalidate: false });
    respond('{"result":"ok"}');
    await mdFetch("/manga");
    for (const [, init] of fetchMock.mock.calls) {
      expect(init.cache).toBe("no-store");
      expect(init.next).toBeUndefined();
    }
  });

  it("maps 404 to not_found", async () => {
    respond('{"result":"error"}', 404);
    expect(await kindOf(mdFetch("/manga/x"))).toBe("not_found");
  });

  it("maps 429 to rate_limited", async () => {
    respond("", 429);
    expect(await kindOf(mdFetch("/manga"))).toBe("rate_limited");
  });

  it("maps 503 to unavailable", async () => {
    respond("", 503);
    expect(await kindOf(mdFetch("/manga"))).toBe("unavailable");
  });

  it("maps a thrown fetch (network or timeout) to unavailable, after one retry", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await kindOf(mdFetch("/manga"))).toBe("unavailable");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("recovers when only the first attempt fails to connect", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    fetchMock.mockResolvedValueOnce(new Response('{"result":"ok"}', { status: 200 }));
    expect(await mdFetch("/manga")).toEqual({ result: "ok" });
  });

  it("does not retry an answer MangaDex actually gave", async () => {
    respond("", 503);
    await kindOf(mdFetch("/manga"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps a 200 body with result 'error' to unavailable", async () => {
    respond('{"result":"error","errors":[]}');
    expect(await kindOf(mdFetch("/manga"))).toBe("unavailable");
  });

  it("maps a 200 non-JSON body to unavailable", async () => {
    respond("Redirecting to bot challenge page...");
    expect(await kindOf(mdFetch("/manga"))).toBe("unavailable");
  });
});
