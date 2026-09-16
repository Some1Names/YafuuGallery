"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import AdminArcRow from "./AdminArcRow";

interface ArcItem {
  id: string;
  arc_name: string;
  arc_order: number;
  arc_is_ex: boolean;
  arc_status: "ongoing" | "completed";
  arc_image_url: string | null;
}

interface AdminArcListProps {
  mangaId: string;
  arcs: ArcItem[];
  // Controlled from AdminMangaRow so editing a row and opening the create
  // form mutually close each other — only one arc-related form is ever
  // open at a time.
  editingArcId: string | null;
  onToggleEdit: (arcId: string) => void;
}

const PAGE_SIZE = 5;

// A blank row matching a real AdminArcRow's collapsed-view box model
// (same cover width, same p-4 + text-base/text-sm stack) so that padding
// the page out to PAGE_SIZE rows reserves the exact same height a full
// page would take, rather than a guessed pixel value.
function ArcRowPlaceholder() {
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

// Every arc — including the special "ex" one — lives in a single ordered
// list here, sorted by arc_order (a plain position/sort key with no
// reserved values). Whether a row is "ex" is its own arc_is_ex column, so
// it's a completely normal, draggable member of this list and can end up
// anywhere in the sequence.
//
// A regular arc's displayed "#001" number is NOT its raw arc_order — it's
// "how many non-ex arcs come before it", recomputed from scratch on every
// render. That's what makes dragging ex around not perturb anyone else's
// number: moving it changes its own position but never the relative order
// of the regular arcs to each other.
//
// Drag-and-drop reorders on drop, not incrementally on every dragover.
// Mutating the list (and therefore the DOM) mid-drag used to reshuffle
// rows out from under the cursor while the browser was still tracking one
// as the drop target, which made the native drop event stop firing
// partway through a drag. Tracking dragOverIndex separately keeps every
// row's position — and its drop-target tracking — stable for the whole
// gesture; only the hover highlight updates until the actual drop.
export default function AdminArcList({ mangaId, arcs, editingArcId, onToggleEdit }: AdminArcListProps) {
  const router = useRouter();
  const [ordered, setOrdered] = useState(() => arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setOrdered(arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
  }, [arcs]);

  const totalCount = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const pageItems = ordered.slice(pageStart, pageStart + PAGE_SIZE);
  const placeholderCount = PAGE_SIZE - pageItems.length;

  const displayNumbers = new Map<string, number>();
  let regularCounter = 0;
  for (const a of ordered) {
    if (!a.arc_is_ex) {
      regularCounter += 1;
      displayNumbers.set(a.id, regularCounter);
    }
  }

  async function commitOrder(nextOrdered: ArcItem[]): Promise<boolean> {
    const res = await fetch("/api/admin/arcs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manga_id: mangaId, ordered_ids: nextOrdered.map((a) => a.id) }),
    });

    if (res.ok) {
      setOrdered(nextOrdered);
      router.refresh();
      return true;
    }

    // Snap back to the last known-good server order on failure.
    setOrdered(arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
    return false;
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
            <ArcRowPlaceholder key={i} />
          ))}
        </div>
        <p className="absolute inset-0 flex items-center justify-center text-xs text-[#6b655e]">
          No arcs yet — create one above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pageItems.map((a, localIndex) => {
        const index = pageStart + localIndex;
        const isBeingEdited = editingArcId === a.id;
        return (
          <div
            key={a.id}
            draggable={!isBeingEdited}
            onDragStart={(e) => {
              // Firefox refuses to continue a drag that never calls
              // setData in dragstart — the payload itself is unused
              // since state (dragIndex) already tracks what's moving.
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", a.id);
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
              <AdminArcRow
                id={a.id}
                name={a.arc_name}
                isEx={a.arc_is_ex}
                displayNumber={displayNumbers.get(a.id) ?? 0}
                status={a.arc_status}
                imageUrl={a.arc_image_url}
                arcOrder={a.arc_order}
                isEditing={isBeingEdited}
                onToggleEdit={() => onToggleEdit(a.id)}
              />
            </div>
          </div>
        );
      })}

      {Array.from({ length: placeholderCount }).map((_, i) => (
        <ArcRowPlaceholder key={`placeholder-${i}`} />
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
