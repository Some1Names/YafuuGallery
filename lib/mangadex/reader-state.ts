// The MangaDex reader's decisions, as plain functions so they can be
// tested without a browser. MdReader is the only caller.

export type ReadingMode = "vertical" | "horizontal";

// The same localStorage key the PDF reader uses (ChapterReaderClient),
// so a reader's scroll / page-by-page choice carries across both.
export const READING_MODE_KEY = "yfgll_reading_mode";

// A long strip (webtoon) is drawn as one tall column and is unreadable
// page by page, so it always opens as a scroll. Otherwise: the reader's
// saved choice, defaulting to scroll like the PDF reader.
export function initialMode(saved: string | null, longStrip: boolean): ReadingMode {
  if (longStrip) return "vertical";
  return saved === "horizontal" ? "horizontal" : "vertical";
}

// Reading a long strip must not overwrite the choice a reader made for
// ordinary manga.
export function shouldPersistMode(longStrip: boolean): boolean {
  return !longStrip;
}

// Pages are 1..total; total + 1 is the end-of-chapter panel, so paging
// forward off the last page lands there rather than doing nothing.
export function stepPage(current: number, total: number, action: "forward" | "back"): number {
  const next = action === "forward" ? current + 1 : current - 1;
  return Math.min(Math.max(next, 1), total + 1);
}

// Which way a tap on the left or right half of the page turns it. Manga
// (rtl) reads right to left, so the next page is on the LEFT.
export function actionForSide(side: "left" | "right", direction: "rtl" | "ltr"): "forward" | "back" {
  const forwardSide = direction === "rtl" ? "left" : "right";
  return side === forwardSide ? "forward" : "back";
}

// The pages to fetch ahead of the one on screen in page-by-page mode.
export function preloadTargets(current: number, total: number): number[] {
  return [current + 1, current + 2].filter((page) => page <= total);
}

// Page image addresses expire after a few minutes, so a chapter left
// open needs a fresh set — possibly several times in one sitting. A
// fresh set is fetched at most once a minute: often enough to recover,
// rare enough that a run of failing images can't hammer MangaDex.
export const REFRESH_COOLDOWN_MS = 60_000;

export function canRefresh(lastRefreshAt: number | null, now: number): boolean {
  return lastRefreshAt === null || now - lastRefreshAt >= REFRESH_COOLDOWN_MS;
}

// What the reader knows when a page image fails or its retry button is
// pressed.
export interface RefreshState {
  refreshRunning: boolean;
  lastRefreshAt: number | null;
}

// A page image failed to load:
//   "wait"    — a fresh set of addresses is already on its way
//   "refresh" — fetch a fresh set for the whole chapter
//   "fail"    — one was fetched moments ago; show this page's retry button
export function onImageError(state: RefreshState, now: number): "wait" | "refresh" | "fail" {
  if (state.refreshRunning) return "wait";
  return canRefresh(state.lastRefreshAt, now) ? "refresh" : "fail";
}

// A page's retry button was pressed:
//   "refresh" — the addresses may be stale by now; fetch a fresh set
//   "reload"  — ask for that one image again
export function onRetry(state: RefreshState, now: number): "refresh" | "reload" {
  return !state.refreshRunning && canRefresh(state.lastRefreshAt, now) ? "refresh" : "reload";
}
