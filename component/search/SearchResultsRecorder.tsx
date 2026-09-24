"use client";

import { recordSearch } from "@/lib/recent-searches";

interface SearchResultsRecorderProps {
  query: string;
  children: React.ReactNode;
}

// Wraps the (server-rendered) results grid: opening any result counts as
// a committed search for recent-search history, same as pressing Enter —
// with search-as-you-type, many searches never involve an Enter at all.
export default function SearchResultsRecorder({ query, children }: SearchResultsRecorderProps) {
  return (
    <div
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) recordSearch(query);
      }}
    >
      {children}
    </div>
  );
}
