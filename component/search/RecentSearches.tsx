"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "yfgll_recent_searches";
const MAX_ENTRIES = 8;

function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Private browsing / storage disabled — history just won't persist.
  }
}

interface RecentSearchesProps {
  query: string;
}

// Recent search history lives in localStorage, not the database — it's a
// per-browser convenience that doesn't need to sync across devices or
// require an account, so there's no server round-trip involved.
//
// This component does double duty: it silently records `query` into
// history whenever a real search lands on the page, and — only when the
// page has no query — renders that history as clickable chips with a
// Clear button. `history` starts null (not []) so the server-rendered
// empty state doesn't flash before localStorage is readable on mount.
export default function RecentSearches({ query }: RecentSearchesProps) {
  const [history, setHistory] = useState<string[] | null>(null);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    console.log("[RS-DEBUG] recording effect, query=", JSON.stringify(query));
    if (!query) return;
    setHistory((current) => {
      const existing = current ?? readHistory();
      const deduped = existing.filter((h) => h.toLowerCase() !== query.toLowerCase());
      const next = [query, ...deduped].slice(0, MAX_ENTRIES);
      console.log("[RS-DEBUG] writing history:", JSON.stringify(next));
      writeHistory(next);
      console.log("[RS-DEBUG] after write, localStorage now:", localStorage.getItem(STORAGE_KEY));
      return next;
    });
  }, [query]);

  function clearHistory() {
    writeHistory([]);
    setHistory([]);
  }

  if (query !== "" || !history || history.length === 0) return null;

  return (
    <div className="mb-10 -mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-[#6b655e]">Recent Searches</p>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-[#6b655e] hover:text-[#ece6d8] transition-colors duration-200"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="px-3 py-1.5 bg-[#1b1a1c] border border-[#050505] rounded-full text-sm text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
