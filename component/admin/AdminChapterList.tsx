"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import AdminChapterRow from "./AdminChapterRow";

interface ChapterItem {
  id: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
}

interface AdminChapterListProps {
  mangaId: string;
  chapters: ChapterItem[];
  arcs: { id: string; arc_name: string }[];
  editingChapterId: string | null;
  onToggleEdit: (chapterId: string) => void;
}

const PAGE_SIZE = 5;

// A blank row matching a real AdminChapterRow's collapsed-view box model
// (same cover width, same p-4 + text-base/text-sm stack) so that padding
// the page out to PAGE_SIZE rows reserves the exact same height a full
// page would take, rather than a guessed pixel value.
function ChapterRowPlaceholder() {
  return (
    <div className="rounded-md overflow-hidden" aria-hidden="true">
      <div className="flex">
        <div className="w-24 sm:w-32 shrink-0" />
        <div className="flex-1 p-4">
          <p className="text-base">&nbsp;</p>
          <p className="text-sm mt-0.5">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

// Every chapter — including the special "ex" one — lives in a single
// ordered list here, sorted by chapter_number (a plain position/sort key
// with no reserved values). Whether a row is "ex" is its own chapter_is_ex
// column, so it's a completely normal, draggable member of this list and
// can end up anywhere in the sequence. Mirrors AdminArcList exactly.
//
// A regular chapter's displayed "#001" number is NOT its raw
// chapter_number — it's "how many non-ex chapters come before it",
// recomputed from scratch on every render. That's what makes dragging ex
// around not perturb anyone else's number: moving it changes its own
// position but never the relative order of the regular chapters to each
// other.
//
// Drag-and-drop reorders on drop, not incrementally on every dragover.
// Mutating the list (and therefore the DOM) mid-drag used to reshuffle
// rows out from under the cursor while the browser was still tracking one
// as the drop target, which made the native drop event stop firing
// partway through a drag. Tracking dragOverIndex separately keeps every
// row's position — and its drop-target tracking — stable for the whole
// gesture; only the hover highlight updates until the actual drop.
export default function AdminChapterList({
  mangaId,
  chapters,
  arcs,
  editingChapterId,
  onToggleEdit,
}: AdminChapterListProps) {
  const router = useRouter();
  const [ordered, setOrdered] = useState(() =>
    chapters.slice().sort((a, b) => a.chapterNumber - b.chapterNumber)
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setOrdered(chapters.slice().sort((a, b) => a.chapterNumber - b.chapterNumber));
  }, [chapters]);

  const hasEx = ordered.some((c) => c.chapterIsEx);
  const totalCount = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const pageItems = ordered.slice(pageStart, pageStart + PAGE_SIZE);
  const placeholderCount = PAGE_SIZE - pageItems.length;

  const displayNumbers = new Map<string, number>();
  let regularCounter = 0;
  for (const c of ordered) {
    if (!c.chapterIsEx) {
      regularCounter += 1;
      displayNumbers.set(c.id, regularCounter);
    }
  }

  async function commitOrder(nextOrdered: ChapterItem[]): Promise<boolean> {
    const res = await fetch("/api/admin/chapters/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manga_id: mangaId, ordered_ids: nextOrdered.map((c) => c.id) }),
    });

    if (res.ok) {
      setOrdered(nextOrdered);
      router.refresh();
      return true;
    }

    // Snap back to the last known-good server order on failure.
    setOrdered(chapters.slice().sort((a, b) => a.chapterNumber - b.chapterNumber));
    return false;
  }

  // Used by AdminChapterRow's edit form when the position dropdown
  // changes — moves this chapter to `newIndex` (0-indexed) within the full
  // list.
  async function reorderChapter(chapterId: string, newIndex: number): Promise<boolean> {
    const currentIndex = ordered.findIndex((c) => c.id === chapterId);
    if (currentIndex === -1 || currentIndex === newIndex) return true;

    const next = ordered.slice();
    const [moved] = next.splice(currentIndex, 1);
    const insertAt = Math.min(Math.max(newIndex, 0), next.length);
    next.splice(insertAt, 0, moved);
    return commitOrder(next);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    if (dragOverIndex !== index) setDragOverIndex(index);
  }

  async function handleDrop() {
    const from = dragIndex;
    const to = dragOverIndex;
    setDragIndex(null);
    setDragOverIndex(null);
    if (from === null || to === null || from === to) return;

    const next = ordered.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    await commitOrder(next);
  }

  if (totalCount === 0) {
    return (
      <div className="relative">
        <div className="flex flex-col gap-3" aria-hidden="true">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ChapterRowPlaceholder key={i} />
          ))}
        </div>
        <p className="absolute inset-0 flex items-center justify-center text-xs text-[#6b655e]">
          No chapters yet — create one above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pageItems.map((c, localIndex) => {
        const index = pageStart + localIndex;
        const isBeingEdited = editingChapterId === c.id;
        return (
          <div
            key={c.id}
            draggable={!isBeingEdited}
            onDragStart={(e) => {
              // Firefox refuses to continue a drag that never calls
              // setData in dragstart — the payload itself is unused
              // since state (dragIndex) already tracks what's moving.
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", c.id);
              setDragIndex(index);
            }}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={() => {
              setDragIndex(null);
              setDragOverIndex(null);
            }}
            className={`flex items-stretch gap-1.5 transition-opacity duration-150 ${
              dragIndex === index ? "opacity-50" : ""
            } ${
              dragIndex !== null && dragIndex !== index && dragOverIndex === index
                ? "outline outline-2 outline-[#ece6d8] rounded-md"
                : ""
            }`}
          >
            {!isBeingEdited && (
              <div className="flex items-center px-1 text-[#6b655e] hover:text-[#b6b0a2] cursor-grab active:cursor-grabbing transition-colors duration-200">
                <GripVertical className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <AdminChapterRow
                id={c.id}
                arcId={c.arcId}
                arcName={c.arcName}
                isEx={c.chapterIsEx}
                displayNumber={displayNumbers.get(c.id) ?? 0}
                chapterName={c.chapterName}
                publishedDate={c.publishedDate}
                coverImageUrl={c.coverImageUrl}
                arcs={arcs}
                position={index}
                totalCount={totalCount}
                hasOtherEx={hasEx && !c.chapterIsEx}
                isEditing={isBeingEdited}
                onToggleEdit={() => onToggleEdit(c.id)}
                onReorder={(newIndex) => reorderChapter(c.id, newIndex)}
              />
            </div>
          </div>
        );
      })}

      {Array.from({ length: placeholderCount }).map((_, i) => (
        <ChapterRowPlaceholder key={`placeholder-${i}`} />
      ))}

      {totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] disabled:opacity-40 disabled:hover:text-[#b6b0a2] disabled:hover:border-[#050505] transition-colors duration-200"
          >
            Prev
          </button>
          <span className="text-xs text-[#6b655e]">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] disabled:opacity-40 disabled:hover:text-[#b6b0a2] disabled:hover:border-[#050505] transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
