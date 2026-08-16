import Link from "next/link";
import type { ArcItem } from "./types";

interface ChapterArcTabsProps {
  activeView: "chapters" | "arcs";
  chapterCount: number;
  sortOrder: "asc" | "desc";
  filteredArc: ArcItem | null | undefined;
}

// Tab header: Chapters/Arcs switcher, chapter-count + sort toggle (chapters
// view only), and the "filtered by this arc" indicator underneath.
export default function ChapterArcTabs({
  activeView,
  chapterCount,
  sortOrder,
  filteredArc,
}: ChapterArcTabsProps) {
  return (
    <>
      <h2 className="text-xl uppercase tracking-wide mb-4 flex justify-between items-center font-(family-name:--font-display)">
        <div className="flex items-end gap-3">
          <Link
            href="?"
            className={
              "transition-all duration-200 " +
              (activeView === "chapters"
                ? "text-xl text-[#ece6d8]"
                : "text-sm text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Chapters
          </Link>

          <Link
            href="?view=arcs"
            className={
              "transition-all duration-200 " +
              (activeView === "arcs"
                ? "text-xl text-[#ece6d8]"
                : "text-sm text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Arcs
          </Link>
        </div>

        {activeView === "chapters" && (
          <div className="flex items-center gap-3">
            <span className="text-xs normal-case text-[#b6b0a2] font-mono">
              {chapterCount} chapters
            </span>

            <Link
              href={`?${filteredArc ? `arc=${filteredArc.id}&` : ""}sort=${
                sortOrder === "asc" ? "desc" : "asc"
              }`}
              className="flex items-center gap-1 text-xs normal-case text-[#b6b0a2] hover:text-[#ece6d8] border border-[#050505] rounded px-2 py-1 transition-colors duration-200 font-mono"
              title={sortOrder === "asc" ? "Sort: oldest first" : "Sort: newest first"}
            >
              Ch. #{sortOrder === "asc" ? "↑" : "↓"}
            </Link>
          </div>
        )}
      </h2>

      {activeView === "chapters" && filteredArc && (
        <Link
          href="?"
          className="inline-flex items-center gap-2 text-xs text-[#b6b0a2] hover:text-[#ece6d8] font-mono mb-4 transition-colors duration-200"
        >
          ← All chapters
          <span className="text-[#ece6d8]">({filteredArc.arc_name})</span>
        </Link>
      )}
    </>
  );
}
