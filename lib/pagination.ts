// "Show more" pagination for server-rendered grids (home, search): the URL
// carries how many pages are currently shown (?page=3 = the first 3 pages'
// worth), and each "Show more" link just bumps it by one. Plain links, no
// client state — works with JS off, survives a refresh, and can be shared.

// Hard ceiling so a hand-edited ?page=999999 can't ask the database for an
// unbounded result set.
const MAX_PAGES = 50;

export function parsePageCount(raw: string | string[] | undefined): number {
  const n = Number.parseInt(Array.isArray(raw) ? raw[0] : (raw ?? ""), 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, MAX_PAGES) : 1;
}

// Fetch one row past the limit to learn whether a next page exists, without
// a separate COUNT query. Returns the rows to show plus that flag.
export function splitExtraRow<T>(rows: T[], limit: number): { items: T[]; hasMore: boolean } {
  return { items: rows.slice(0, limit), hasMore: rows.length > limit };
}
