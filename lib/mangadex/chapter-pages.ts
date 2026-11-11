// Paging for the chapter list on a MangaDex title page. Long-running
// series have hundreds of chapters; shown all at once the page runs on
// for screens and the details column is left stranded at the top.

export const CHAPTERS_PER_PAGE = 20;

// How many pages a list of `total` chapters takes. Never 0: an empty
// list is still one (empty) page.
export function pageCount(total: number, size = CHAPTERS_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / size));
}

// The chapters on `page` (1-based). A page outside the range is treated
// as the nearest real one.
export function pageSlice<T>(items: T[], page: number, size = CHAPTERS_PER_PAGE): T[] {
  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount(items.length, size));
  return items.slice((current - 1) * size, current * size);
}

// What the pager shows: the first page, the last, the current one and
// its two neighbours, with "gap" where pages are left out —
// 1 … 9 10 11 … 20. A gap is never used to hide just one page; that page
// is shown instead, since it takes no more room than the dots.
export function pagerItems(current: number, total: number): (number | "gap")[] {
  // few enough to list them all
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  for (const p of [...wanted]) {
    if (wanted.has(p + 2) && p + 1 <= total) wanted.add(p + 1);
  }
  // near either end, keep three pages in a row so the pager doesn't
  // shrink to "1 2 … 20"
  if (current <= 2) for (const p of [2, 3]) if (p <= total) wanted.add(p);
  if (current >= total - 1) for (const p of [total - 1, total - 2]) if (p >= 1) wanted.add(p);

  const pages = [...wanted].sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("gap");
    items.push(p);
  });
  return items;
}
