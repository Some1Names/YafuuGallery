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
