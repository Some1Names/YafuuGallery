"use client";

import { useCallback, useEffect, useState } from "react";

interface PageState<T> {
  url: string;
  items: T[] | null; // null = first page still loading
  nextCursor: string | null;
  error: boolean;
}

// Loads a paged admin list (GET <endpoint>?…&cursor= → { items, nextCursor },
// see lib/admin-lists.ts) one page at a time. Changing `params` (a new
// search, a filter) starts over from the first page; loadMore() appends the
// next. removeItem/updateItem let a row reflect an action (delete, dismiss)
// without refetching the whole list.
export function usePagedList<T extends { id: string }>(
  endpoint: string,
  params: Record<string, string | undefined>
) {
  const query = new URLSearchParams(
    Object.entries(params).filter((e): e is [string, string] => Boolean(e[1]))
  ).toString();
  const url = query ? `${endpoint}?${query}` : endpoint;

  const [state, setState] = useState<PageState<T>>({ url, items: null, nextCursor: null, error: false });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // New search/filter: back to "loading" right away, during render (React's
  // "adjusting state when a prop changes" pattern), so the previous
  // results never show for a frame under the new search.
  if (state.url !== url) {
    setState({ url, items: null, nextCursor: null, error: false });
  }

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ items: T[]; nextCursor: string | null }>;
      })
      .then((data) => {
        if (!cancelled) setState({ url, items: data.items, nextCursor: data.nextCursor, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ url, items: [], nextCursor: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const loadMore = useCallback(async () => {
    if (!state.nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const sep = url.includes("?") ? "&" : "?";
      const res = await fetch(`${url}${sep}cursor=${encodeURIComponent(state.nextCursor)}`);
      if (!res.ok) throw new Error();
      const data: { items: T[]; nextCursor: string | null } = await res.json();
      setState((s) =>
        s.url === url ? { ...s, items: [...(s.items ?? []), ...data.items], nextCursor: data.nextCursor } : s
      );
    } catch {
      setState((s) => (s.url === url ? { ...s, error: true } : s));
    } finally {
      setIsLoadingMore(false);
    }
  }, [url, state.nextCursor, isLoadingMore]);

  const removeItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items?.filter((item) => item.id !== id) ?? null }));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<T>) => {
    setState((s) => ({ ...s, items: s.items?.map((item) => (item.id === id ? { ...item, ...patch } : item)) ?? null }));
  }, []);

  return {
    items: state.url === url ? state.items : null,
    hasMore: state.nextCursor !== null,
    isLoadingMore,
    error: state.error,
    loadMore,
    removeItem,
    updateItem,
  };
}

// The search box's value, settled for `ms` — so typing doesn't fire a
// request per keystroke.
export function useDebounced<T>(value: T, ms = 300): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}
