"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  clearRecentSearches,
  getRecentSearchesSnapshot,
  parseRecentSearches,
  subscribeToRecentSearches,
} from "@/lib/recent-searches";

interface RecentSearchesProps {
  query: string;
}

// Renders the viewer's recent searches (see lib/recent-searches.ts) as
// clickable chips with a Clear button — only when the page has no query.
// Recording happens elsewhere (SearchInput on Enter, SearchResultsRecorder
// on opening a result). The server snapshot is null (not "") so nothing
// renders until localStorage is actually readable on the client.
export default function RecentSearches({ query }: RecentSearchesProps) {
  const raw = useSyncExternalStore(subscribeToRecentSearches, getRecentSearchesSnapshot, () => null);
  const history = useMemo(() => (raw === null ? null : parseRecentSearches(raw)), [raw]);

  if (query !== "" || !history || history.length === 0) return null;

  return (
    <div className="mb-10 -mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-fg-muted">Recent Searches</p>
        <button
          type="button"
          onClick={clearRecentSearches}
          className="text-xs text-fg-muted hover:text-fg transition-colors duration-200"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
