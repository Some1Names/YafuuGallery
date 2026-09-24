// Recent search history, kept in localStorage — a per-browser convenience
// that doesn't need an account or a server round trip. Exposed as a tiny
// external store (subscribe/getSnapshot) so components read it through
// useSyncExternalStore and stay in sync when another component — or
// another tab, via the "storage" event — records or clears a search.

const STORAGE_KEY = "yfgll_recent_searches";
const CHANGE_EVENT = "yfgll-recent-searches-change";
const MAX_ENTRIES = 8;

export function parseRecentSearches(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// Returns the raw stored string (a stable primitive, so React can compare
// snapshots cheaply); "" when nothing's stored or storage is unavailable.
export function getRecentSearchesSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToRecentSearches(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function write(entries: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Private browsing / storage disabled — history just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Only called for a *committed* search (Enter, or opening a result) — not
// on every keystroke of the search-as-you-type box, which would otherwise
// fill the history with "v", "ve", "vei"...
export function recordSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const existing = parseRecentSearches(getRecentSearchesSnapshot());
  const deduped = existing.filter((h) => h.toLowerCase() !== trimmed.toLowerCase());
  write([trimmed, ...deduped].slice(0, MAX_ENTRIES));
}

export function clearRecentSearches() {
  write([]);
}
