# MangaDex Zone Phase 1 (Browse and Read) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Readers can search MangaDex and read its chapters inside YafuuGallery at `/browse`, `/browse/[id]` and `/read/[chapterId]`, fetched live with nothing stored.

**Architecture:** All MangaDex API calls happen on the server through `lib/mangadex/`, with pure mapping functions separated from fetching so they are unit-tested against saved API responses. Covers are passed through a cached route handler; chapter page images are loaded by the browser directly from MangaDex's image network. The reader is a new client component; the existing PDF reader is untouched.

**Tech Stack:** Next.js 16 App Router (server components, route handlers), React 19, TypeScript, Tailwind 4, next-intl, Vitest, Bun.

**Spec:** `docs/superpowers/specs/2026-11-10-mangadex-browse-read-design.md`

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code (`AGENTS.md`). Already confirmed for this plan: `cacheComponents` is off, so caching is `fetch(url, { next: { revalidate: seconds } })`; page and route `params` / `searchParams` are Promises; `error.tsx` receives `{ error, retry }` (not `reset`).
- No change to `prisma/schema.prisma`, `component/titles/ChapterReaderClient.tsx`, `app/(main)/search`, the home page, `app/sitemap.ts`, admin, or `next.config.ts`.
- Nothing outside `lib/mangadex/` and the two `app/api/mangadex/` routes calls `fetch` against a MangaDex host.
- User-Agent on every MangaDex request: `YafuuGallery/1.0 (+${SITE_URL})`, `SITE_URL` from `@/lib/site-url`. Never a browser User-Agent.
- Content rating: only `safe` and `suggestive`, on every call. Languages: only `th` and `en`.
- Array query parameters are encoded as `key%5B%5D=value`.
- Chapter page images: data-saver quality only, plain `<img referrerPolicy="no-referrer">`, never `next/image`. Covers: plain `<img>` pointing at our cover route.
- `messages/en.json` and `messages/th.json` must keep identical keys (the typecheck enforces it).
- The nav already has a "Browse" item for `/search`. The new item's label is **MangaDex** (`Nav.mangadex`) in both languages.
- Commit to `master` after each task and push (project workflow). Commit messages end with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Checks that must pass before each commit: `bun run test`, `bun run lint`, `bunx tsc --noEmit`.

## Review Focus

1. A series with more than 500 chapters in one language (One Piece, English): the feed must be paged until complete, and the chapter list must show all of them. Test in Task 3.
2. A chapter with no number (oneshot) or a title with no Thai or English title (only `ja-ro`): must render with a fallback label, not `null` or a crash. Tests in Task 2.
3. A valid chapter or manga UUID whose content rating is `erotica` or `pornographic`, opened by direct URL: must be the 404 page. Test in Task 3.
4. MangaDex returns `result: "error"` or an empty page list from the at-home endpoint for a chapter that lists pages: the reader page must show the error boundary, not an empty reader. Test in Task 3.
5. Search text with characters that matter in URLs (`&`, `#`, `[`, Thai script) or longer than 200 characters: must be encoded, trimmed to 200, and never break the request. Test in Task 1.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `lib/mangadex/types.ts` | Raw API shapes we read; app-facing shapes; `MangaDexError` |
| `lib/mangadex/client.ts` | `mdFetch`: URL building, headers, timeout, error mapping |
| `lib/mangadex/map.ts` | Pure functions: raw JSON to app shapes, chapter ordering and navigation |
| `lib/mangadex/queries.ts` | Named queries the pages call |
| `lib/mangadex/__fixtures__/*.json` | Saved real API responses |
| `app/api/mangadex/cover/[mangaId]/[fileName]/route.ts` | Cover pass-through |
| `app/api/mangadex/chapter/[chapterId]/pages/route.ts` | Fresh page URLs for the reader |
| `component/mangadex/MdMangaCard.tsx` | Card in browse grids |
| `component/mangadex/MdLanguageFilter.tsx` | All / ไทย / English links |
| `component/mangadex/MdSourceCredit.tsx` | "Source: MangaDex" link and group names |
| `component/mangadex/MdChapterList.tsx` | Chapter rows on the title page |
| `component/mangadex/MdReader.tsx` | Image reader |
| `app/(main)/browse/page.tsx`, `[id]/page.tsx`, `error.tsx` | Browse and title pages |
| `app/(fullscreen)/read/[chapterId]/page.tsx`, `error.tsx` | Reader page |

---

### Task 1: Types and HTTP client

**Files:**
- Create: `lib/mangadex/types.ts`, `lib/mangadex/client.ts`
- Test: `lib/mangadex/client.test.ts`

**Interfaces:**
- Produces:

```ts
// types.ts
export type MdLanguage = "th" | "en";
export const MD_LANGUAGES: readonly MdLanguage[] = ["th", "en"];
export const MD_CONTENT_RATINGS = ["safe", "suggestive"] as const;
export type MdStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

export interface MdMangaSummary {
  id: string; title: string; coverUrl: string | null;
  status: MdStatus; languages: MdLanguage[];
}
export interface MdManga extends MdMangaSummary {
  synopsis: string; genres: string[]; authors: string[];
  longStrip: boolean; direction: "rtl" | "ltr"; mangadexUrl: string;
}
export interface MdChapter {
  id: string; number: string | null; title: string | null;
  language: MdLanguage; groups: string[]; publishedAt: string;
  pages: number; externalUrl: string | null;
}
export type MdErrorKind = "not_found" | "rate_limited" | "unavailable";
export class MangaDexError extends Error { constructor(public kind: MdErrorKind, message?: string) }

// Raw shapes (only the fields we read): RawManga, RawChapter, RawRelationship,
// RawCollection<T> { data: T[]; total: number; limit: number; offset: number },
// RawEntity<T> { data: T }, RawAtHome { baseUrl: string; chapter: { hash: string; dataSaver: string[] } }

// client.ts
export type MdParams = Record<string, string | number | readonly string[] | Record<string, string> | undefined>;
export function buildMdUrl(path: string, params?: MdParams): string;
export function mdFetch<T>(path: string, params?: MdParams, opts?: { revalidate?: number | false }): Promise<T>;
export function isUuid(value: string): boolean;
export function cleanSearchText(q: string | undefined): string;
```

`direction` is added to `MdManga` (the spec derives it from `originalLanguage`; the reader needs it as data).

- [ ] **Step 1: Write the failing tests** in `lib/mangadex/client.test.ts`

```ts
describe("buildMdUrl", () => {
  it("encodes array params with %5B%5D", () => {
    expect(buildMdUrl("/manga", { contentRating: ["safe", "suggestive"], limit: 24 }))
      .toBe("https://api.mangadex.org/manga?contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&limit=24");
  });
  it("encodes object params as key%5Bsub%5D", () => {
    expect(buildMdUrl("/manga", { order: { followedCount: "desc" } }))
      .toBe("https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc");
  });
  it("skips undefined and encodes special characters", () => {
    expect(buildMdUrl("/manga", { title: "a&b #1 [x] มังงะ", offset: undefined }))
      .toBe("https://api.mangadex.org/manga?title=" + encodeURIComponent("a&b #1 [x] มังงะ"));
  });
});
describe("cleanSearchText", () => {
  it("trims, collapses whitespace, caps at 200 chars, undefined -> ''", () => {
    expect(cleanSearchText("  one   piece ")).toBe("one piece");
    expect(cleanSearchText("x".repeat(500))).toHaveLength(200);
    expect(cleanSearchText(undefined)).toBe("");
  });
});
describe("isUuid", () => {
  it("accepts a v4-style uuid, rejects anything else", () => {
    expect(isUuid("a1c7c817-4e59-43b7-9365-09675a149a6f")).toBe(true);
    expect(isUuid("../etc")).toBe(false);
    expect(isUuid("a1c7c817-4e59-43b7-9365-09675a149a6f/x")).toBe(false);
  });
});
describe("mdFetch", () => {
  // vi.stubGlobal("fetch", vi.fn()) per test; vi.unstubAllGlobals() in afterEach
  it("sends the honest User-Agent and next.revalidate", async () => {
    // fetch resolves new Response('{"result":"ok"}', { status: 200 })
    await mdFetch("/manga", {}, { revalidate: 300 });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["User-Agent"]).toMatch(/^YafuuGallery\/1\.0 \(\+https?:\/\//);
    expect(init.next).toEqual({ revalidate: 300 });
  });
  it("uses cache: 'no-store' when revalidate is false", ...);          // init.cache === "no-store", no init.next
  it("maps 404 -> not_found, 429 -> rate_limited, 503 -> unavailable", ...); // rejects MangaDexError with that kind
  it("maps a thrown fetch (network/timeout) -> unavailable", ...);
  it("maps a 200 body with result: 'error' -> unavailable", ...);
  it("maps a 200 non-JSON body -> unavailable", ...);
});
```

- [ ] **Step 2: Run** `bun run test lib/mangadex/client.test.ts`. Expected: FAIL, module not found.

- [ ] **Step 3: Implement `types.ts` and `client.ts`.** Base URL `https://api.mangadex.org`. Parameters are emitted in the object's insertion order. Timeout 10 s via `AbortSignal.timeout(10_000)`. Default `revalidate` when `opts` is omitted: `false` (no-store). `isUuid` regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`.

- [ ] **Step 4: Run** `bun run test lib/mangadex/client.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit** `MangaDex: API client and types`.

---

### Task 2: Mapping functions and fixtures

**Files:**
- Create: `lib/mangadex/map.ts`, `lib/mangadex/__fixtures__/manga-list.json`, `manga-detail.json`, `feed.json`
- Test: `lib/mangadex/map.test.ts`

**Interfaces:**
- Consumes: types from Task 1.
- Produces:

```ts
export function pickLocalized(map: Record<string, string> | undefined, locale: MdLanguage, alt?: Record<string, string>[]): string;
export function coverPath(mangaId: string, relationships: RawRelationship[], size?: 256 | 512): string | null;
export function toMangaSummary(raw: RawManga, locale: MdLanguage): MdMangaSummary;
export function toManga(raw: RawManga, locale: MdLanguage): MdManga;
export function toChapter(raw: RawChapter): MdChapter | null;      // null: unavailable or language not th/en
export function sortChapters(chapters: MdChapter[]): MdChapter[];   // ascending
export function isReadable(c: MdChapter): boolean;                  // pages > 0 && !externalUrl
export function adjacentChapters(sorted: MdChapter[], currentId: string): { prev: MdChapter | null; next: MdChapter | null };
export function chapterLabel(c: MdChapter, t: { chapter: (n: string) => string; oneshot: string }): string;
```

- [ ] **Step 1: Save fixtures** from the live API (run from the repo root; each is committed as-is):

```bash
UA="YafuuGallery-dev/0.1"; F=lib/mangadex/__fixtures__; mkdir -p $F
curl -s -g -A "$UA" "https://api.mangadex.org/manga?limit=5&title=one%20piece&includes%5B%5D=cover_art&contentRating%5B%5D=safe" -o $F/manga-list.json
curl -s -g -A "$UA" "https://api.mangadex.org/manga/a1c7c817-4e59-43b7-9365-09675a149a6f?includes%5B%5D=cover_art&includes%5B%5D=author" -o $F/manga-detail.json
curl -s -g -A "$UA" "https://api.mangadex.org/manga/a1c7c817-4e59-43b7-9365-09675a149a6f/feed?limit=20&translatedLanguage%5B%5D=en&order%5Bchapter%5D=asc&includes%5B%5D=scanlation_group" -o $F/feed.json
```

Verify each file starts with `{"result":"ok"`. Add `"lib/mangadex/__fixtures__"` handling only if ESLint complains about JSON (it should not).

- [ ] **Step 2: Write the failing tests** in `map.test.ts`. Fixture-based tests assert against values read from the fixture (id, cover file name) rather than hardcoding strings that may differ on the day the fixture is saved. Hand-built inputs use a local `ch(partial)` helper that fills an `MdChapter` with defaults.

```ts
describe("pickLocalized", () => {
  it("prefers the locale", () => expect(pickLocalized({ en: "A", th: "ก" }, "th")).toBe("ก"));
  it("falls back to en", () => expect(pickLocalized({ en: "A", ja: "あ" }, "th")).toBe("A"));
  it("looks in alt titles for the locale before falling back", () =>
    expect(pickLocalized({ en: "A" }, "th", [{ ja: "あ" }, { th: "ก" }])).toBe("ก"));
  it("falls back to the first value when neither exists", () => expect(pickLocalized({ "ja-ro": "Wan" }, "th")).toBe("Wan"));
  it("returns '' for undefined or empty", () => { expect(pickLocalized(undefined, "en")).toBe(""); expect(pickLocalized({}, "en")).toBe(""); });
});
describe("coverPath", () => {
  it("builds our route path from the cover_art relationship", () =>
    expect(coverPath("m1", [{ id: "c", type: "cover_art", attributes: { fileName: "abc.png" } }], 256))
      .toBe("/api/mangadex/cover/m1/abc.png?size=256"));
  it("defaults to size 256", ...);
  it("is null with no cover_art or no fileName attribute", ...);
});
describe("toMangaSummary (fixture)", () => {
  it("maps id, non-empty title, cover path, status", ...);
  it("languages keeps only th/en from availableTranslatedLanguages, th first", ...); // input ["en","fr","th"] -> ["th","en"]
});
describe("toManga", () => {
  it("genres are tag names with group === 'genre' only", ...);
  it("longStrip is true when a tag named 'Long Strip' exists (format group)", ...);
  it("direction is rtl for originalLanguage 'ja', ltr otherwise", ...);
  it("authors come from author relationships, de-duplicated", ...);
  it("mangadexUrl is https://mangadex.org/title/<id>", ...);
  it("a manga whose only title is ja-ro still gets a non-empty title", ...);
});
describe("toChapter", () => {
  it("maps number, title, language, groups, pages, externalUrl", ...);
  it("returns null when isUnavailable is true", ...);
  it("returns null for a language other than th/en", ...);
  it("groups is [] when no scanlation_group has attributes", ...);
});
describe("sortChapters", () => {
  it("orders numerically: '9' < '10', '12' < '12.5' < '13'", ...);
  it("puts null numbers last, keeping their publishedAt order", ...);
  it("ties on number are ordered by publishedAt ascending", ...);
});
describe("adjacentChapters", () => {
  // list: 1(gA) 2(gA) 2(gB) 3(gB,external) 4(gA)
  it("next from 1(gA) is 2(gA): same group preferred", ...);
  it("next from 2(gB) is 4(gA): externals skipped, other uploads of the same number are not 'next'", ...);
  it("prev from 4(gA) is 2(gA)", ...);
  it("prev of the first and next of the last are null", ...);
  it("an unknown currentId gives { prev: null, next: null }", ...);
  it("a null-number chapter has no prev/next", ...);
});
describe("chapterLabel", () => {
  const t = { chapter: (n: string) => `Ch. ${n}`, oneshot: "Oneshot" };
  it("'Ch. 12 - Title' with a title", ...);
  it("'Ch. 12' without", ...);
  it("'Oneshot' for a null number with no title; the title alone when it has one", ...);
});
```

- [ ] **Step 3: Run** `bun run test lib/mangadex/map.test.ts`. Expected: FAIL, module not found.

- [ ] **Step 4: Implement `map.ts`.** `adjacentChapters` rule: consider only `isReadable` chapters with a non-null number; take the nearest different number in that direction; among uploads of that number prefer one sharing a group name with the current chapter, else the earliest `publishedAt`.

- [ ] **Step 5: Run** `bun run test lib/mangadex/map.test.ts`. Expected: PASS.

- [ ] **Step 6: Commit** `MangaDex: response mapping and chapter navigation`.

---

### Task 3: Queries

**Files:**
- Create: `lib/mangadex/queries.ts`
- Test: `lib/mangadex/queries.test.ts`

**Interfaces:**
- Consumes: `mdFetch`, `isUuid`, `cleanSearchText` (Task 1); mappers (Task 2).
- Produces:

```ts
export type MdLanguageFilter = MdLanguage | "all";
export const MD_PAGE_SIZE = 24;
export function searchManga(a: { q: string; lang: MdLanguageFilter; page: number; locale: MdLanguage }): Promise<{ items: MdMangaSummary[]; hasMore: boolean }>;
export function getPopular(lang: MdLanguageFilter, locale: MdLanguage): Promise<MdMangaSummary[]>;  // 12 items
export function getLatest(lang: MdLanguageFilter, locale: MdLanguage): Promise<MdMangaSummary[]>;   // 12 items
export function getManga(id: string, locale: MdLanguage): Promise<MdManga>;
export function getChapterFeed(mangaId: string, language: MdLanguage): Promise<MdChapter[]>;         // sorted ascending
export function getChapter(id: string): Promise<{ chapter: MdChapter; mangaId: string }>;
export function getChapterPages(id: string): Promise<string[]>;                                      // absolute data-saver URLs
```

Fixed request details:

| Function | Path and parameters | Revalidate |
| --- | --- | --- |
| `searchManga` | `/manga`: `title` (omitted when empty), `limit: 24`, `offset: (page-1)*24`, `includes: ["cover_art"]`, `contentRating`, `availableTranslatedLanguage: lang === "all" ? ["th","en"] : [lang]`, `hasAvailableChapters: "true"`, `order: { relevance: "desc" }` (with a title) or `{ followedCount: "desc" }` (without). `hasMore = offset + limit < total`. `page` is clamped to 1..400 (MangaDex rejects `offset + limit > 10000`). | 300 |
| `getPopular` | as `searchManga` without title, `limit: 12`, `order: { followedCount: "desc" }` | 300 |
| `getLatest` | same, `order: { latestUploadedChapter: "desc" }` | 300 |
| `getManga` | `/manga/{id}`: `includes: ["cover_art","author"]`. Not a UUID: throw `not_found` without fetching. Content rating not in `MD_CONTENT_RATINGS`: throw `not_found`. | 3600 |
| `getChapterFeed` | `/manga/{id}/feed`: `limit: 500`, `offset`, `translatedLanguage: [language]`, `contentRating`, `includes: ["scanlation_group"]`, `order: { chapter: "asc" }`. Repeat with `offset += 500` until `offset >= total`, at most 10 requests. | 600 |
| `getChapter` | `/chapter/{id}`: `includes: ["scanlation_group","manga"]`. `mangaId` from the `manga` relationship. `toChapter` null, or no manga relationship: throw `not_found`. Then `await getManga(mangaId, "en")` so a disallowed rating becomes `not_found`. | 3600 |
| `getChapterPages` | `/at-home/server/{id}`. Result: `${baseUrl}/data-saver/${hash}/${file}` for each `dataSaver` file. Empty list: throw `unavailable`. | `false` |

- [ ] **Step 1: Write the failing tests** with `vi.stubGlobal("fetch", …)` returning `Response` objects built from small inline bodies:

```ts
it("getChapterFeed pages until total is reached", ...);
// total 1200 -> exactly 3 fetches with offset=0, 500, 1000; result length is the sum of mapped chapters
it("getChapterFeed stops after 10 requests", ...);                    // total 99999
it("getManga rejects a non-uuid as not_found without fetching", ...); // fetch mock not called
it("getManga rejects contentRating 'erotica' as not_found", ...);
it("getChapter rejects when its manga is 'pornographic'", ...);
it("getChapterPages builds data-saver URLs in order", ...);
// baseUrl "https://x.mangadex.network", hash "h", dataSaver ["1.jpg","2.jpg"]
// -> ["https://x.mangadex.network/data-saver/h/1.jpg", ".../2.jpg"]
it("getChapterPages rejects an empty page list as unavailable", ...);
it("searchManga omits title when q is empty and sets hasMore from total", ...);
it("searchManga clamps page to 400", ...);                            // offset=9576 in the request URL
it("every /manga and /feed request carries exactly contentRating safe + suggestive", ...);
```

- [ ] **Step 2: Run** `bun run test lib/mangadex/queries.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement `queries.ts`** per the table.
- [ ] **Step 4: Run** `bun run test`. Expected: all PASS.
- [ ] **Step 5: Live smoke check.** Run `bun -e 'import("./lib/mangadex/queries.ts").then(async q => { const r = await q.searchManga({ q: "one piece", lang: "en", page: 1, locale: "en" }); console.log(r.items[0]); const f = await q.getChapterFeed(r.items[0].id, "en"); console.log(f.length, f.at(-1)); })'`. Expected: a summary with a title and cover path, and a feed longer than 500. If `next`-specific fetch options fail outside Next, run the same lines from a temporary `app/api/mangadex/_smoke/route.ts` under `bun run dev` and delete it afterwards.
- [ ] **Step 6: Commit** `MangaDex: queries`.

---

### Task 4: Route handlers

**Files:**
- Create: `app/api/mangadex/cover/[mangaId]/[fileName]/route.ts`, `app/api/mangadex/chapter/[chapterId]/pages/route.ts`, `lib/mangadex/cover.ts`
- Test: `lib/mangadex/cover.test.ts`

**Interfaces:**
- Consumes: `isUuid`, `getChapter`, `getChapterPages`, `MangaDexError`.
- Produces:

```ts
// lib/mangadex/cover.ts
export function coverUpstreamUrl(mangaId: string, fileName: string, size: string | null): string | null;
```

`GET /api/mangadex/chapter/{id}/pages` returns `{ pages: string[] }` (200), or `{ error: MdErrorKind }` with status 404 / 429 / 502.

- [ ] **Step 1: Write the failing tests** for `coverUpstreamUrl`:

```ts
const M = "a1c7c817-4e59-43b7-9365-09675a149a6f", F = "2f4aca53-64c7-46ac-ae85-3bc9b3169890.png";
it("builds the 256 thumbnail URL by default", () =>
  expect(coverUpstreamUrl(M, F, null)).toBe(`https://uploads.mangadex.org/covers/${M}/${F}.256.jpg`));
it("accepts size 512", () => expect(coverUpstreamUrl(M, F, "512")).toBe(`https://uploads.mangadex.org/covers/${M}/${F}.512.jpg`));
it("treats any other size as 256", () => expect(coverUpstreamUrl(M, F, "9999")).toMatch(/\.256\.jpg$/));
it("rejects a non-uuid manga id", () => expect(coverUpstreamUrl("x", F, null)).toBeNull());
it.each(["../../secret.png", "a.png", F + "/x", F.replace(".png", ".svg"), "http://evil/" + F])(
  "rejects file name %s", (f) => expect(coverUpstreamUrl(M, f, null)).toBeNull());
```

File name rule: `/^[0-9a-f-]{36}\.(jpg|jpeg|png|gif|webp)$/i`.

- [ ] **Step 2: Run**, expect FAIL. **Step 3: Implement `cover.ts`.** **Step 4: Run**, expect PASS.

- [ ] **Step 5: Implement the cover route.** `coverUpstreamUrl` null: 404. Fetch upstream with the Task 1 User-Agent and `cache: "no-store"` (the CDN header below does the caching; the Data Cache should not hold image bodies). Upstream not ok, or `content-type` not starting with `image/`: 404. Otherwise stream the body with the upstream `Content-Type` and `Cache-Control: public, max-age=86400, s-maxage=2592000, immutable`.

- [ ] **Step 6: Implement the pages route.** Call `getChapter(id)` first (enforces the rating rule), then `getChapterPages(id)`. Response header `Cache-Control: no-store`. Map `MangaDexError.kind` to status: `not_found` 404, `rate_limited` 429, `unavailable` 502.

- [ ] **Step 7: Verify under `bun run dev`:**

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" "http://localhost:3000/api/mangadex/cover/a1c7c817-4e59-43b7-9365-09675a149a6f/2f4aca53-64c7-46ac-ae85-3bc9b3169890.png"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/mangadex/cover/x/y.png"
curl -s "http://localhost:3000/api/mangadex/chapter/not-a-uuid/pages"
```

Expected: `200 image/jpeg`, `404`, `{"error":"not_found"}`. If the cover file name has changed upstream, take a current one from `manga-detail.json`.

- [ ] **Step 8: Commit** `MangaDex: cover and chapter-pages routes`.

---

### Task 5: Browse page, nav link, robots

**Files:**
- Create: `app/(main)/browse/page.tsx`, `app/(main)/browse/error.tsx`, `component/mangadex/MdMangaCard.tsx`, `component/mangadex/MdLanguageFilter.tsx`, `lib/mangadex/browse-params.ts`
- Modify: `component/Navbar.tsx:24-30` (`navItems`), `app/robots.ts`, `messages/en.json`, `messages/th.json`
- Test: `lib/mangadex/browse-params.test.ts`

**Interfaces:**
- Consumes: `searchManga`, `getPopular`, `getLatest`, `MdMangaSummary`, `MdLanguageFilter`.
- Produces:

```ts
// browse-params.ts
export function parseBrowseParams(sp: { q?: string | string[]; lang?: string | string[]; page?: string | string[] }, locale: MdLanguage):
  { q: string; lang: MdLanguageFilter; page: number };
export function browseHref(p: { q?: string; lang?: MdLanguageFilter; page?: number }): string;
// components
MdMangaCard({ manga }: { manga: MdMangaSummary })       // links to /browse/{id}
MdLanguageFilter({ q, active }: { q: string; active: MdLanguageFilter })
```

- [ ] **Step 1: Write the failing tests** for `browse-params`:

```ts
it("defaults lang to the interface locale, page to 1, q to ''", () =>
  expect(parseBrowseParams({}, "th")).toEqual({ q: "", lang: "th", page: 1 }));
it("accepts lang all|th|en and ignores anything else", ...);        // "fr" -> locale default
it("takes the first value of array params", ...);
it("clamps page: '0', '-3', 'abc' -> 1; '9999' -> 400", ...);
it("cleans q", () => expect(parseBrowseParams({ q: "  a   b " }, "en").q).toBe("a b"));
it("browseHref omits empty q and page 1, always keeps lang", () => {
  expect(browseHref({ lang: "en" })).toBe("/browse?lang=en");
  expect(browseHref({ q: "a&b", lang: "all", page: 2 })).toBe("/browse?q=a%26b&lang=all&page=2");
});
```

- [ ] **Step 2: Run**, expect FAIL. **Step 3: Implement.** **Step 4: Run**, expect PASS.

- [ ] **Step 5: Add interface text.** New `Browse` namespace in both files, and `Nav.mangadex`:

| Key | en | th |
| --- | --- | --- |
| `Nav.mangadex` | MangaDex | MangaDex |
| `Browse.title` | Browse MangaDex | สำรวจ MangaDex |
| `Browse.description` | Search and read manga from MangaDex. | ค้นหาและอ่านมังงะจาก MangaDex |
| `Browse.searchPlaceholder` | Search MangaDex… | ค้นหาใน MangaDex… |
| `Browse.langAll` | All | ทั้งหมด |
| `Browse.popular` | Popular | ยอดนิยม |
| `Browse.latest` | Latest updates | อัปเดตล่าสุด |
| `Browse.resultsFor` | Results for “{q}” | ผลการค้นหา “{q}” |
| `Browse.empty` | Nothing found. | ไม่พบผลลัพธ์ |
| `Browse.emptyTryOther` | Try {language} instead. | ลองค้นหาใน{language} |
| `Browse.showMore` | Show more | แสดงเพิ่มเติม |
| `Browse.source` | Source: MangaDex | ที่มา: MangaDex |
| `Browse.errorTitle` | MangaDex is not responding | MangaDex ไม่ตอบสนอง |
| `Browse.errorMessage` | The rest of the site is fine. Try again in a moment. | ส่วนอื่นของเว็บยังใช้งานได้ ลองใหม่อีกครั้งในอีกสักครู่ |
| `Browse.status.ongoing` / `completed` / `hiatus` / `cancelled` | Ongoing / Completed / On hiatus / Cancelled | ยังไม่จบ / จบแล้ว / พักการเขียน / ยกเลิก |

Language names for badges and `emptyTryOther` reuse the existing `LanguageName` namespace.

- [ ] **Step 6: Build the page and components.** Look at `app/(main)/search/page.tsx`, `component/MangaCard.tsx`, `component/search/SearchInput.tsx` and `component/ShowMoreLink.tsx` first and match their layout classes, grid, and tokens (`text-fg`, `border-border`, …).
  - `page.tsx`: `export const metadata` with `title` from `Browse.title` via `generateMetadata`, `robots: { index: false, follow: false }`. Locale from `getLocale()` narrowed to `MdLanguage` (anything else is `"en"`).
  - Search box: a plain `<form action="/browse" method="get">` with `q` and a hidden `lang`; no client component needed.
  - With `q`: heading `resultsFor` and one grid holding pages `1..page` (fetched with `Promise.all`, concatenated, 24 items each), then a "Show more" link to `page + 1` when the last page's `hasMore` is true. To keep one visit from firing many requests, at most the last 5 pages are fetched: for `page > 5` the grid starts at page `page - 4`.
  - Without `q`: two sections, `popular` and `latest`, 12 cards each, fetched with `Promise.all`.
  - Empty result: `empty`, plus `emptyTryOther` linking to the other language when `lang` is `th` or `en`.
  - `MdMangaCard`: `<img src={coverUrl} loading="lazy" alt="">` in the same aspect box as `MangaCard`, `NoImagePlaceholder` when `coverUrl` is null, title (2-line clamp), status text, one small badge per language.
  - `error.tsx`: copy `app/(main)/error.tsx`, using `Browse.errorTitle` / `Browse.errorMessage`; keep the `{ error, retry }` props.

- [ ] **Step 7: Nav and robots.** Append `{ href: "/browse", labelKey: "mangadex", icon: Library }` (lucide-react) to `navItems`. The active check is `pathname === item.href`; change it so `/browse/...` also marks the item active without changing the other three (for example `item.href === "/browse" ? pathname.startsWith("/browse") : pathname === item.href`), in both the desktop and the mobile list. Add `"/browse"` and `"/read"` to `disallow` in `app/robots.ts`.

- [ ] **Step 8: Run** `bun run test && bun run lint && bunx tsc --noEmit`. Expected: clean.

- [ ] **Step 9: Verify in the browser** (`preview_start` the dev server): `/browse` shows two rows with covers; searching "one piece" shows results; the three language links change the list; a nonsense query shows the empty state; "Show more" adds a page; phone width has no horizontal scroll; light and dark both readable; the nav item is active on `/browse`; `/robots.txt` lists `/browse` and `/read`.

- [ ] **Step 10: Commit** `MangaDex: browse page`.

---

### Task 6: Title page

**Files:**
- Create: `app/(main)/browse/[id]/page.tsx`, `component/mangadex/MdChapterList.tsx`, `component/mangadex/MdSourceCredit.tsx`
- Modify: `messages/en.json`, `messages/th.json`

**Interfaces:**
- Consumes: `getManga`, `getChapterFeed`, `sortChapters`, `isReadable`, `chapterLabel`, `MangaDexError`.
- Produces:

```ts
MdSourceCredit({ href, groups }: { href: string; groups?: string[] })
MdChapterList({ chapters, emptyText }: { chapters: MdChapter[]; emptyText: string })   // receives newest-first
```

- [ ] **Step 1: Add interface text** (`Browse` namespace):

| Key | en | th |
| --- | --- | --- |
| `chapters` | Chapters | ตอนทั้งหมด |
| `chapterNumber` | Ch. {n} | ตอนที่ {n} |
| `oneshot` | Oneshot | ตอนเดียวจบ |
| `startReading` | Start reading | เริ่มอ่าน |
| `officialSite` | Official site | เว็บทางการ |
| `noChapters` | No chapters in this language. | ยังไม่มีตอนในภาษานี้ |
| `translatedBy` | Translated by {groups} | แปลโดย {groups} |
| `by` | By {authors} | โดย {authors} |

- [ ] **Step 2: Build the page.** Look at `app/(main)/manga/titles/[id]/page.tsx`, `component/titles/MangaHero.tsx` and `ChapterRow.tsx` and match their layout.
  - `searchParams.lang`: `th` or `en`; default is the interface locale if `manga.languages` includes it, else `manga.languages[0]`.
  - `getManga` and `getChapterFeed` run in parallel. A `MangaDexError` of kind `not_found` calls `notFound()`; other kinds are rethrown to `browse/error.tsx`.
  - `generateMetadata`: title is the manga title, `robots: { index: false, follow: false }`. It must swallow `MangaDexError` and return `{}` so a 404 is not turned into a metadata crash.
  - Hero: cover (`?size=512`), title, `by`, status, genre chips, synopsis (plain text, `whitespace-pre-line`; MangaDex synopses contain Markdown, which is shown as-is), `MdSourceCredit` with `mangadexUrl`.
  - Language switch (links to `?lang=`) only when `manga.languages.length > 1`.
  - "Start reading" links to the first `isReadable` chapter in ascending order; hidden when there is none.
  - `MdChapterList` rows, newest first: `chapterLabel`, group names (`translatedBy`), date via the existing `component/LocalDate.tsx`. A readable chapter links to `/read/{id}`. A chapter with `externalUrl` renders `<a href target="_blank" rel="noopener noreferrer">` with the `officialSite` marker and an external-link icon. A chapter that is neither (zero pages, no external URL) is omitted.
  - `MdSourceCredit`: `Browse.source` as a link opening in a new tab; when `groups` is non-empty, `translatedBy` after it.

- [ ] **Step 3: Run** `bun run test && bun run lint && bunx tsc --noEmit`. Expected: clean.

- [ ] **Step 4: Verify in the browser:** a card from `/browse` opens its title page; One Piece (English) lists more than 500 rows and the official-site rows open MangaPlus in a new tab; a title with both languages shows the switch and it changes the list; `/browse/not-a-uuid` and `/browse/00000000-0000-4000-8000-000000000000` show the 404 page; phone width, light and dark.

- [ ] **Step 5: Commit** `MangaDex: title page`.

---

### Task 7: Reader

**Files:**
- Create: `app/(fullscreen)/read/[chapterId]/page.tsx`, `app/(fullscreen)/read/[chapterId]/error.tsx`, `component/mangadex/MdReader.tsx`, `lib/mangadex/reader-state.ts`
- Modify: `messages/en.json`, `messages/th.json`
- Test: `lib/mangadex/reader-state.test.ts`

**Interfaces:**
- Consumes: `getChapter`, `getManga`, `getChapterFeed`, `getChapterPages`, `adjacentChapters`, `isReadable`, `chapterLabel`; `GET /api/mangadex/chapter/{id}/pages`.
- Produces:

```ts
// reader-state.ts (pure, so the reader's decisions are testable without a DOM)
export type ReadingMode = "vertical" | "horizontal";
export const READING_MODE_KEY = "yfgll_reading_mode";
export function initialMode(saved: string | null, longStrip: boolean): ReadingMode;
export function shouldPersistMode(longStrip: boolean): boolean;
export function stepPage(current: number, total: number, action: "forward" | "back"): number;      // 1-based, clamped
export function actionForSide(side: "left" | "right", direction: "rtl" | "ltr"): "forward" | "back";
export function preloadTargets(current: number, total: number): number[];                          // next two pages

// MdReader props
interface MdReaderProps {
  chapterId: string; mangaId: string; mangaTitle: string; chapterLabel: string;
  groups: string[]; mangadexUrl: string; pageUrls: string[];
  longStrip: boolean; direction: "rtl" | "ltr";
  prevChapterId: string | null; nextChapterId: string | null;
  chapters: { id: string; label: string }[];
}
```

`defaultMode` from the spec is replaced by `longStrip`: the component derives the mode with `initialMode`, which keeps the rule in one tested place.

- [ ] **Step 1: Write the failing tests:**

```ts
it("initialMode: long strip is always vertical", () => expect(initialMode("horizontal", true)).toBe("vertical"));
it("initialMode: uses a valid saved value, else vertical", () => {
  expect(initialMode("horizontal", false)).toBe("horizontal");
  expect(initialMode("junk", false)).toBe("vertical");
  expect(initialMode(null, false)).toBe("vertical");
});
it("shouldPersistMode is false for long strip", ...);
it("stepPage clamps to 1..total", () => {
  expect(stepPage(1, 10, "back")).toBe(1); expect(stepPage(10, 10, "forward")).toBe(10); expect(stepPage(3, 10, "forward")).toBe(4);
});
it("actionForSide: rtl left = forward, rtl right = back; ltr is the reverse", ...);
it("preloadTargets: [n+1, n+2] within total", () => {
  expect(preloadTargets(1, 10)).toEqual([2, 3]); expect(preloadTargets(9, 10)).toEqual([10]); expect(preloadTargets(10, 10)).toEqual([]);
});
```

The fallback for no saved mode must match what `readSavedMode()` in `component/titles/ChapterReaderClient.tsx:28` returns; read it and change the expected default above if it is `horizontal`.

- [ ] **Step 2: Run**, expect FAIL. **Step 3: Implement `reader-state.ts`.** **Step 4: Run**, expect PASS.

- [ ] **Step 5: Add interface text**, new `MdReader` namespace:

| Key | en | th |
| --- | --- | --- |
| `back` | Back to title | กลับไปหน้าเรื่อง |
| `chapterMenu` | Chapters | เลือกตอน |
| `modeVertical` | Scroll | เลื่อน |
| `modeHorizontal` | Page by page | ทีละหน้า |
| `pageOf` | {page} / {total} | {page} / {total} |
| `pageAlt` | Page {page} | หน้า {page} |
| `prevChapter` | Previous chapter | ตอนก่อนหน้า |
| `nextChapter` | Next chapter | ตอนถัดไป |
| `endOfChapter` | End of chapter | จบตอน |
| `lastChapter` | You're up to date. | คุณอ่านถึงตอนล่าสุดแล้ว |
| `imageFailed` | This page didn't load. | โหลดหน้านี้ไม่สำเร็จ |
| `retry` | Try again | ลองใหม่ |

- [ ] **Step 6: Build the server page.**
  - `getChapter(chapterId)`; `not_found` calls `notFound()`.
  - Not `isReadable`: `redirect(`/browse/${mangaId}`)`.
  - Then in parallel: `getManga(mangaId, locale)`, `getChapterFeed(mangaId, chapter.language)`, `getChapterPages(chapterId)`.
  - `adjacentChapters(feed, chapterId)` gives prev / next ids. `chapters` for the menu: readable chapters only, newest first, label from `chapterLabel` plus the group names when the same number appears more than once.
  - `generateMetadata`: `${chapterLabel} · ${mangaTitle}`, `robots: { index: false, follow: false }`, swallowing `MangaDexError`.
  - `error.tsx`: copy `app/(fullscreen)/error.tsx` with the `Browse.errorTitle` / `errorMessage` text and a link back to `/browse`.

- [ ] **Step 7: Build `MdReader`.** Read `component/titles/ChapterReaderClient.tsx` (top bar markup around the `barFullscreen` state, swipe handling around line 623, mode toggle) and `component/titles/ChapterEndNav.tsx`, and reuse their class names and look; do not import from or edit `ChapterReaderClient`.
  - State: `mode`, `page` (1-based), `urls` (starts as `pageUrls`), `failed: Set<number>`, `refreshed: boolean`, `barVisible`.
  - Mode is initialised in a `useEffect` from `localStorage.getItem(READING_MODE_KEY)` via `initialMode` (SSR renders vertical), and written back on toggle only when `shouldPersistMode(longStrip)`. Wrap storage access in try/catch.
  - Vertical: every page `<img src loading="lazy" decoding="async" referrerPolicy="no-referrer" alt={pageAlt}>`, full width up to `max-w-3xl`, centred; the first two are `loading="eager"`. `page` follows scroll with one `IntersectionObserver`.
  - Horizontal: one `<img>` fitted to the viewport (`object-contain`, `h-dvh`); clicking the left or right half calls `stepPage` with `actionForSide`; ArrowLeft / ArrowRight do the same; touch swipe past 50 px does the same; `preloadTargets` are rendered as hidden `<link rel="preload" as="image">` or `new Image()` in an effect.
  - Stepping forward on the last page in horizontal mode shows the end panel instead of doing nothing.
  - Top bar: back link to `/browse/{mangaId}`, manga title, `chapterLabel`, `MdSourceCredit` with `groups`, a native `<select>` chapter menu that `router.push`es `/read/{id}`, mode toggle, `pageOf`. Hidden on scroll down, shown on scroll up (vertical) or on a centre tap (horizontal).
  - End panel (after the last page in vertical, replacing the page in horizontal): `endOfChapter`, previous / next links; `lastChapter` text when `nextChapterId` is null.
  - Image error: on the first `onError` anywhere, if `!refreshed`, fetch `/api/mangadex/chapter/{chapterId}/pages`, set `urls` and `refreshed = true` (which re-requests every image). An error after that adds the page to `failed`; a failed slot shows `imageFailed` and a `retry` button that removes it from `failed` and appends `?r={Date.now()}` to that one URL.
  - When `chapterId` changes (client navigation), reset `page` to 1, `urls` to the new `pageUrls`, `failed` and `refreshed`; use `key={chapterId}` on the component in the page so this needs no effect.

- [ ] **Step 8: Run** `bun run test && bun run lint && bunx tsc --noEmit`. Expected: clean.

- [ ] **Step 9: Verify in the browser:**
  - Open a hosted Thai chapter from a title page: pages load in vertical mode; the network panel shows images coming from `*.mangadex.network` with status 200 and none through `/_next/image`.
  - Toggle to page-by-page: left/right click, arrow keys, and the direction matches a Japanese title (left = forward). Reload: the mode is remembered. Open a PDF chapter on `/viewer/...`: it opens in the same mode.
  - A long-strip title (search "Solo Leveling") opens vertical even with page-by-page saved, and the saved value is still `horizontal` afterwards.
  - Next / previous at the end move between chapters; the chapter menu jumps; the last chapter shows the up-to-date text.
  - Block `*.mangadex.network` in the browser, reload: after one refresh attempt each page shows the retry button; unblock and retry loads it.
  - `/read/not-a-uuid`: 404. `/read/{id of an external chapter}`: lands on the title page.
  - Phone width: swipe works and nothing scrolls sideways.

- [ ] **Step 10: Commit** `MangaDex: image reader`.

---

### Task 8: README and final check

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update `README.md`.** Under Discovering, add: `📚 MangaDex zone at /browse: search and read MangaDex titles in Thai or English, fetched live (nothing stored), with scanlation group credit`. In Project Structure, add `browse` to the `(main)` line, `read` to the `(fullscreen)` line, `mangadex` to the `api/` line, and a line noting `lib/mangadex/` holds every MangaDex call. Add a short "MangaDex" section stating the rules that must hold: no ads on these pages, group credit shown, pages not indexed, only safe and suggestive ratings.
- [ ] **Step 2: Run** `bun run test && bun run lint && bunx tsc --noEmit && bun run build`. Expected: all pass; the build lists `/browse`, `/browse/[id]`, `/read/[chapterId]` as dynamic routes.
- [ ] **Step 3: Confirm nothing else moved:** `git diff --stat <first-task-parent>..HEAD -- prisma component/titles app/sitemap.ts next.config.ts "app/(main)/search" "app/(main)/page.tsx"` prints nothing.
- [ ] **Step 4: Commit** `README: MangaDex zone`, push, then open the deployed `/browse` and read one chapter on the live site: covers load through the cover route and pages load from MangaDex's network in production too.
