# MangaDex zone, phase 1: browse and read

Date: 2026-11-10
Status: awaiting review

## Goal

Readers can search MangaDex and read its chapters inside YafuuGallery, in a
zone kept visibly separate from the site's own manga. Nothing from MangaDex
is stored in our database or in R2: every page is fetched live.

This is phase 1 of three. It ships on its own.

| Phase | Scope |
| --- | --- |
| **1 (this spec)** | Browse, title page, image reader. No database changes, no sign-in needed. |
| 2 | Resume position, reading history, favorites. Adds `ExternalManga` / `ExternalChapter` reference tables that `ReadingProgress` and `Bookmark` can point to. |
| 3 | Comments on MangaDex chapters, including reports and moderation. |

Phases 2 and 3 get their own specs. Phase 1 must not make them harder: the
reader takes its chapter identity as props, so progress saving and the
comment panel can be attached later without restructuring it.

## What was measured (2026-11-10)

These results come from requests made against the live API and drive the
design below.

| Check | Result | Consequence |
| --- | --- | --- |
| `api.mangadex.org` called with a foreign `Origin` | 200, but no `Access-Control-Allow-Origin` | Browsers cannot call the API. All API calls are made on our server. |
| Cover image (`uploads.mangadex.org`) with a browser User-Agent | 302 to a bot-challenge page | Covers cannot be loaded by `<img>` directly. |
| Cover image with an honest client User-Agent | 200 `image/jpeg` | Covers are fetched by our server and passed on. |
| Chapter page, data-saver quality (`*.mangadex.network`), browser User-Agent, our site as `Referer` | 200 `image/jpeg`, `cross-origin-resource-policy: cross-origin` | The browser loads page images directly. They do not pass through Vercel. |
| Chapter page, full quality, same request | 404 in the one test made | Cause unknown. Phase 1 uses data-saver only. |
| Chapters with `externalUrl` set (for example MangaPlus) | `pages: 0`, no images | Cannot be read in-site. Link out. |
| Catalogue size | Thai: about 676 titles, 4,700 hosted chapters. English: about 54,800 titles, 800,000 chapters. | Thai alone is too thin. English is the fallback. |

## Routes

| Route | Layout group | Purpose |
| --- | --- | --- |
| `/browse` | `(main)` | Search box, language filter, results grid. With no query: "Popular" and "Latest updates" rows. |
| `/browse/[id]` | `(main)` | Title page: cover, title, synopsis, genres, status, chapter list. `id` is the MangaDex manga UUID. |
| `/read/[chapterId]` | `(fullscreen)` | Image reader. `chapterId` is the MangaDex chapter UUID. |
| `/api/mangadex/cover/[mangaId]/[fileName]` | route handler | Passes a cover thumbnail through from MangaDex. |
| `/api/mangadex/chapter/[chapterId]/pages` | route handler | Returns fresh page image URLs. Used by the reader to recover when images fail. |

All three pages are server components that call `lib/mangadex/`. They are
public: no session is needed.

The navbar gets one new item, "Browse", after the existing page links, on
desktop and in the mobile menu.

## Server: `lib/mangadex/`

One folder holds every contact with MangaDex. Nothing else in the app calls
`fetch` against a MangaDex host.

- `client.ts`: `mdFetch(path, params, { revalidate })`. Sets
  `User-Agent: YafuuGallery/1.0 (+<site url>)` (MangaDex rejects requests
  without one and challenges fake browser ones). Encodes array parameters as
  `key%5B%5D=value`: unencoded brackets returned a non-JSON response in
  testing. Throws `MangaDexError` with a `kind` of `not_found`,
  `rate_limited` or `unavailable`.
- `types.ts`: the raw API shapes we read, and the app-facing shapes below.
- `map.ts`: pure functions from raw API JSON to app shapes. This is where
  the unit tests point.
- `queries.ts`: `searchManga`, `getPopular`, `getLatest`, `getManga`,
  `getChapterFeed`, `getChapter`, `getChapterPages`.

App-facing shapes:

```ts
type MdLanguage = "th" | "en";

interface MdMangaSummary {
  id: string;
  title: string;
  coverUrl: string | null;   // our /api/mangadex/cover/... path
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  languages: MdLanguage[];   // which of th/en have chapters
}

interface MdManga extends MdMangaSummary {
  synopsis: string;
  genres: string[];          // MangaDex tag names, genre group only
  authors: string[];
  longStrip: boolean;        // has the "Long Strip" tag
  mangadexUrl: string;       // https://mangadex.org/title/<id>
}

interface MdChapter {
  id: string;
  number: string | null;     // "12", "12.5"; null for oneshots
  title: string | null;
  language: MdLanguage;
  groups: string[];          // scanlation group names, for credit
  publishedAt: string;       // ISO
  pages: number;
  externalUrl: string | null;
}
```

### Caching

Uses `fetch` revalidation so repeated views do not reach MangaDex. Its
general limit is about 5 requests per second per IP.

| Call | Revalidate |
| --- | --- |
| Search results, popular, latest | 5 minutes |
| Manga details | 1 hour |
| Chapter feed | 10 minutes |
| Chapter details | 1 hour |
| At-home page URLs | never cached: the base URL is short-lived |

The exact caching API (fetch options against `use cache`) is settled in the
implementation plan after reading `node_modules/next/dist/docs/`, as
`AGENTS.md` requires for this Next.js version.

### Fixed query rules

- Content rating: `safe` and `suggestive` only. `erotica` and `pornographic`
  are never requested, on any call, including direct visits to
  `/browse/[id]` and `/read/[chapterId]`: a title or chapter outside the
  allowed ratings returns the 404 page.
- Languages: `th` and `en` only.
- Title choice: the title in the interface language if MangaDex has one,
  else English, else the first title given. Same rule for the synopsis.
- Chapter feed: all pages of the feed are fetched (500 per request) and
  merged, ordered by chapter number ascending. Chapters with
  `isUnavailable` are dropped.

## Pages

### `/browse`

- Search input (submits to `?q=`), and a language filter with three
  choices: All, ไทย, English (`?lang=`). The default follows the interface
  language: Thai interface starts on ไทย, English on English.
- Results: a grid of cards (cover, title, status, language badges), 24 per
  page, with "Show more" paging by `?page=`.
- No query: two rows, Popular (ordered by follows) and Latest updates
  (ordered by latest uploaded chapter), each filtered by the language
  choice.
- A new `MdMangaCard` is used, not `MangaCard`: the existing card is typed
  to Prisma manga and links to `/manga/titles/`.
- Empty result: a message suggesting the other language.

### `/browse/[id]`

- Cover, title, authors, status, genre chips, synopsis.
- "Source: MangaDex" label linking to `mangadexUrl`.
- Chapter list, newest first, with a language switch (shown only if the
  title has both). Each row: chapter number, title, group names, date.
- Several uploads of the same chapter number by different groups are shown
  as separate rows, each with its group.
- A chapter with `externalUrl` shows an "official site" marker and opens
  that URL in a new tab (`rel="noopener noreferrer"`). It does not link to
  `/read/`.
- A "Start reading" button opens the first readable chapter in the chosen
  language.

### `/read/[chapterId]`

The page loads the chapter, its manga, the manga's feed in the chapter's
language, and the at-home page URLs, then renders `MdReader`.

A chapter with `externalUrl` or zero pages redirects to `/browse/[id]`.

## Reader: `component/mangadex/MdReader.tsx`

A new client component. The existing `ChapterReaderClient` (1,260 lines,
bound to react-pdf, the most visited route) is not modified.

Props:

```ts
interface MdReaderProps {
  chapterId: string;
  mangaId: string;
  mangaTitle: string;
  chapterLabel: string;            // "Ch. 12" plus title
  groups: string[];
  pageUrls: string[];              // data-saver, in order
  defaultMode: "vertical" | "horizontal";
  direction: "rtl" | "ltr";
  prevChapterId: string | null;
  nextChapterId: string | null;
  chapters: { id: string; label: string }[];   // for the chapter menu
}
```

Behaviour:

- Two modes, as in the PDF reader. Vertical: all pages in one column,
  images lazy-loaded. Horizontal: one page at a time, tap or click the
  left/right halves, arrow keys, and swipe on touch.
- The mode is read from and saved to the same `yfgll_reading_mode`
  localStorage key the PDF reader uses, so a reader's choice carries
  across both. Exception: a `longStrip` title always opens vertical and
  does not overwrite the saved choice.
- Direction: `rtl` by default. `ltr` when the manga's original language is
  not Japanese (`originalLanguage` other than `ja`). Only affects
  horizontal mode.
- Top bar: back to `/browse/[id]`, manga title, chapter label, group
  credit, chapter menu, mode toggle. It hides on scroll down and returns on
  scroll up, like the existing reader.
- End of chapter: previous / next buttons. Next and previous are the
  adjacent chapter numbers in the same language, preferring the same
  group when a number has several uploads. External chapters are skipped.
- Horizontal mode preloads the next two page images.
- Images are plain `<img>` elements with `referrerPolicy="no-referrer"`,
  not `next/image`: they must go straight to MangaDex's network, not
  through Vercel's image optimizer.
- Image failure: on the first `error` event the reader calls
  `/api/mangadex/chapter/[chapterId]/pages` once, swaps in the new URLs and
  retries. If that also fails, the page slot shows a retry button.

Not in phase 1: resume position, comment panel, favorite button, a
full-quality toggle, two-page spreads.

## Cover pass-through

`GET /api/mangadex/cover/[mangaId]/[fileName]?size=256|512`

- Validates `mangaId` as a UUID and `fileName` against
  `^[0-9a-f-]{36}\.(jpg|jpeg|png|gif|webp)$`, so the route can only ever
  fetch a cover from `uploads.mangadex.org`.
- Fetches `https://uploads.mangadex.org/covers/<mangaId>/<fileName>.<size>.jpg`
  and streams it back with
  `Cache-Control: public, max-age=86400, s-maxage=2592000, immutable`.
  A cover file name never changes content, so the CDN can hold it for 30
  days and our function rarely runs.
- Upstream failure returns 404, and the card shows the existing
  `NoImagePlaceholder`.
- Covers are rendered with plain `<img>`, so `next.config.ts`
  `remotePatterns` is unchanged.

## Attribution and indexing

- Every chapter row and the reader's top bar show the scanlation group
  names. The title page and reader link to the title on MangaDex.
- `/browse`, `/browse/[id]` and `/read/[chapterId]` set
  `robots: { index: false, follow: false }`, and `app/robots.ts` disallows
  `/browse` and `/read`. `app/sitemap.ts` is unchanged, so it lists none of
  them.
- The zone carries no ads. The site has none today; this spec records that
  MangaDex's terms require it to stay that way for these pages.

## Errors

| Situation | Behaviour |
| --- | --- |
| Unknown manga or chapter id, or disallowed content rating | `notFound()` |
| MangaDex returns 429 or 5xx, or the request times out (10 s) | The route's error boundary shows "MangaDex is not responding" with a retry button. The rest of the site is unaffected. |
| Malformed id in the URL | `notFound()` without calling MangaDex |
| Page image fails | Refresh URLs once, then per-page retry button (see Reader) |

## Interface text

New `Browse` and `MdReader` namespaces in `messages/en.json` and
`messages/th.json`, with identical keys, plus a `Navbar` key for the new
link.

## Testing

Unit tests (Vitest) for `lib/mangadex/map.ts`, using JSON fixtures saved
from real API responses:

- title and synopsis choice for `th`, `en`, and neither present
- cover path built from the `cover_art` relationship; null when absent
- chapter ordering: numeric not string order ("9" before "10", "12.5"
  between "12" and "13"), null numbers last
- several groups on one chapter number kept as separate rows
- external and unavailable chapters flagged or dropped as specified
- previous / next choice: same group preferred, externals skipped
- `longStrip` and direction detection
- array parameter encoding in `client.ts`

Checked in the browser, desktop and phone width, light and dark:

- search in Thai and English, language filter, paging, empty result
- title page with one language, with both, and with external chapters
- reader in both modes, chapter menu, previous / next, a long-strip title
- an unknown id, and MangaDex unreachable (simulated)

## Files

New:

- `lib/mangadex/client.ts`, `types.ts`, `map.ts`, `queries.ts`,
  `map.test.ts`, `client.test.ts`, `__fixtures__/*.json`
- `app/(main)/browse/page.tsx`, `app/(main)/browse/[id]/page.tsx`,
  `app/(main)/browse/error.tsx`
- `app/(fullscreen)/read/[chapterId]/page.tsx`
- `app/api/mangadex/cover/[mangaId]/[fileName]/route.ts`
- `app/api/mangadex/chapter/[chapterId]/pages/route.ts`
- `component/mangadex/MdMangaCard.tsx`, `MdChapterList.tsx`,
  `MdLanguageFilter.tsx`, `MdReader.tsx`, `MdSourceCredit.tsx`

Changed:

- `component/Navbar.tsx` (one nav item)
- `app/robots.ts` (two disallow rules)
- `messages/en.json`, `messages/th.json`
- `README.md` (feature list and project structure)

Not changed: `prisma/schema.prisma`, the PDF reader, search, home page,
sitemap, admin.

## Open risks

- **Full-quality images returned 404** in testing. If data-saver quality
  looks poor on large screens, a later change investigates and adds a
  quality toggle.
- **MangaDex can change or withdraw access** at any time. The zone is
  isolated so it can be switched off by removing the nav link and routes.
- **Copyright**: most MangaDex content is fan translation without a
  licence. The owner chose to go ahead knowing this. Mitigations here are the separate
  zone, no local copies, attribution, and no indexing.
