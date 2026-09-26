"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { recordSearch } from "@/lib/recent-searches";
import { DEFAULT_SORT, searchHref, type SearchFilters } from "@/lib/search-filters";
import { useTranslations } from "next-intl";

interface SearchInputProps {
  // The query the page was rendered for (?q=), already trimmed.
  initialQuery: string;
  // The genre/status/sort currently applied — kept when the query changes.
  filters: Omit<SearchFilters, "q">;
}

const DEBOUNCE_MS = 300;
// Typing only auto-searches from this many characters — a single letter
// matches nearly everything, so it's a wasted query. Enter still searches
// any length, and emptying the box still auto-returns to "All manga".
const MIN_AUTO_SEARCH_CHARS = 2;

// Search-as-you-type: results update DEBOUNCE_MS after the last keystroke
// (once there are MIN_AUTO_SEARCH_CHARS) by replacing the URL (?q=), which re-renders the server page — so the
// query stays shareable/refreshable and the results logic lives in one
// place. router.replace, not push, so typing doesn't stack up history
// entries. Enter searches immediately and is what counts as a "committed"
// search for recent-search history (keystrokes don't).
export default function SearchInput({ initialQuery, filters }: SearchInputProps) {
  const t = useTranslations("Search");
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

  // Start in the box on desktop, but not on phones/tablets: there, focus
  // pops the on-screen keyboard over half the page — even for people who
  // arrived from a genre tag to browse, not type.
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) inputRef.current?.focus();
  }, []);

  function navigate(next: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLastSent(next.trim());
    startTransition(() => router.replace(searchHref({ ...filters, q: next }), { scroll: false }));
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
    <form action="/search" method="GET" onSubmit={handleSubmit} role="search" aria-busy={isPending} className="mb-6 sm:mb-10">
      {/* Without JS the form submits natively — carry the filters along. */}
      {filters.genre && <input type="hidden" name="genre" value={filters.genre} />}
      {filters.status && <input type="hidden" name="status" value={filters.status} />}
      {filters.sort !== DEFAULT_SORT && <input type="hidden" name="sort" value={filters.sort} />}
      <div className="relative max-w-xl">
        <label htmlFor="search-input" className="sr-only">
          {t("inputLabel")}
        </label>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          name="q"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t("placeholder")}
          autoComplete="off"
          className="w-full bg-surface border border-border rounded-md pl-10 pr-10 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-fg-secondary transition-colors duration-200"
        />
        {/* Replaces the browser's own native "x" clear button (suppressed
            in globals.css) with one that matches the site's Lucide icons. */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("clear")}
            // p-3: a 40px tap area; right-0.5 keeps the icon where it was
            className="absolute right-0.5 top-1/2 -translate-y-1/2 p-3 text-fg-muted hover:text-fg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
