"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { recordSearch } from "@/lib/recent-searches";

interface SearchInputProps {
  // The query the page was rendered for (?q=), already trimmed.
  initialQuery: string;
}

const DEBOUNCE_MS = 300;
// Typing only auto-searches from this many characters — a single letter
// matches nearly everything, so it's a wasted query. Enter still searches
// any length, and emptying the box still auto-returns to "All manga".
const MIN_AUTO_SEARCH_CHARS = 2;

function searchHref(query: string) {
  const trimmed = query.trim();
  return trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
}

// Search-as-you-type: results update DEBOUNCE_MS after the last keystroke
// (once there are MIN_AUTO_SEARCH_CHARS) by replacing the URL (?q=), which re-renders the server page — so the
// query stays shareable/refreshable and the results logic lives in one
// place. router.replace, not push, so typing doesn't stack up history
// entries. Enter searches immediately and is what counts as a "committed"
// search for recent-search history (keystrokes don't).
export default function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The URL can change without this input being the cause — e.g. clicking
  // a recent-search chip, or back/forward. When it does, show that query.
  // Compared against the last query this input itself sent (state, not a
  // ref, so it's readable during render): the URL catching up to what was
  // typed must NOT overwrite the box, or keystrokes made during the
  // debounce/navigation would be clobbered.
  const [lastSent, setLastSent] = useState(initialQuery);
  const [prevInitial, setPrevInitial] = useState(initialQuery);
  if (initialQuery !== prevInitial) {
    setPrevInitial(initialQuery);
    if (initialQuery !== lastSent) {
      setValue(initialQuery);
      setLastSent(initialQuery);
    }
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  function navigate(next: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLastSent(next.trim());
    startTransition(() => router.replace(searchHref(next), { scroll: false }));
  }

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const length = next.trim().length;
    if (length === 0 || length >= MIN_AUTO_SEARCH_CHARS) {
      debounceRef.current = setTimeout(() => navigate(next), DEBOUNCE_MS);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(value);
    recordSearch(value);
  }

  function handleClear() {
    setValue("");
    navigate("");
    inputRef.current?.focus();
  }

  return (
    <form action="/search" method="GET" onSubmit={handleSubmit} role="search" aria-busy={isPending} className="mb-10">
      <div className="relative max-w-xl">
        <label htmlFor="search-input" className="sr-only">
          Search manga
        </label>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          name="q"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search by title, author, or chapter…"
          autoFocus
          autoComplete="off"
          className="w-full bg-surface border border-border rounded-md pl-10 pr-10 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-fg-secondary transition-colors duration-200"
        />
        {/* Replaces the browser's own native "x" clear button (suppressed
            in globals.css) with one that matches the site's Lucide icons. */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
