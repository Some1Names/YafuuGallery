"use client";

import { useMemo, useState } from "react";
import ChapterList from "./ChapterList";
import ArcList from "./ArcList";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import type { ArcItem, ChapterItem } from "./types";

interface ChapterArcSectionProps {
  arcs: ArcItem[];
  looseChapters: ChapterItem[];
  favoritedChapterIds: string[];
}

// Chapters/Arcs toggle, chapter-count + sort, and the list itself, all in
// one client component driven by local state instead of URL searchParams —
// every arc/chapter is already fetched up front, so switching view/sort/arc
// doesn't need a server round trip and shouldn't reload the page to do it.
export default function ChapterArcSection({ arcs, looseChapters, favoritedChapterIds }: ChapterArcSectionProps) {
  const [activeView, setActiveView] = useState<"chapters" | "arcs">("chapters");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredArcId, setFilteredArcId] = useState<string | null>(null);

  const filteredArc = filteredArcId ? (arcs.find((a) => a.id === filteredArcId) ?? null) : null;

  // Display numbers are computed from every chapter on the manga, not just
  // the currently filtered arc's — otherwise filtering to one arc would
  // renumber its chapters relative to the manga as a whole.
  const displayNumbers = useMemo(
    () => getChapterDisplayNumbers([...arcs.flatMap((arc) => arc.chapters), ...looseChapters]),
    [arcs, looseChapters]
  );

  const chapters = useMemo(() => {
    const base = filteredArc
      ? filteredArc.chapters
      : [...arcs.flatMap((arc) => arc.chapters), ...looseChapters];

    return [...base].sort((a, b) =>
      sortOrder === "asc" ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
    );
  }, [arcs, looseChapters, filteredArc, sortOrder]);

  function selectArc(arcId: string) {
    setFilteredArcId(arcId);
    setActiveView("chapters");
  }

  return (
    <>
      <h2 className="text-xl uppercase tracking-wide mb-4 flex justify-between items-center font-(family-name:--font-display)">
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={() => setActiveView("chapters")}
            className={
              "transition-all duration-200 " +
              (activeView === "chapters"
                ? "text-xl text-[#ece6d8]"
                : "text-sm text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Chapters
          </button>

          <button
            type="button"
            onClick={() => setActiveView("arcs")}
            className={
              "transition-all duration-200 " +
              (activeView === "arcs"
                ? "text-xl text-[#ece6d8]"
                : "text-sm text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Arcs
          </button>
        </div>

        {activeView === "chapters" && (
          <div className="flex items-center gap-3">
            <span className="text-xs normal-case text-[#b6b0a2]">
              {chapters.length} chapters
            </span>

            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="flex items-center gap-1 text-xs normal-case text-[#b6b0a2] hover:text-[#ece6d8] border border-[#050505] rounded px-2 py-1 transition-colors duration-200"
              title={sortOrder === "asc" ? "Sort: oldest first" : "Sort: newest first"}
            >
              Ch. #{sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        )}
      </h2>

      {activeView === "chapters" && filteredArc && (
        <button
          type="button"
          onClick={() => setFilteredArcId(null)}
          className="inline-flex items-center gap-2 text-xs text-[#b6b0a2] hover:text-[#ece6d8] mb-4 transition-colors duration-200"
        >
          ← All chapters
          <span className="text-[#ece6d8]">({filteredArc.arc_name})</span>
        </button>
      )}

      {activeView === "chapters" ? (
        <ChapterList chapters={chapters} favoritedChapterIds={favoritedChapterIds} displayNumbers={displayNumbers} />
      ) : (
        <ArcList arcs={arcs} onSelectArc={selectArc} />
      )}
    </>
  );
}
