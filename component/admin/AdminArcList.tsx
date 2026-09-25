"use client";

import { useEffect, useRef, useState } from "react";
import { alertRequestFailed } from "@/component/Dialog";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import AdminArcRow from "./AdminArcRow";
import AdminSearchInput from "./AdminSearchInput";

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
// Must match the `gap-3` on the list's own flex container below.
const ROW_GAP_PX = 12;

// A blank row matching a real AdminArcRow's collapsed-view box model
// (same cover width, same p-4 + text-base/text-sm stack) so that padding
// the page out to PAGE_SIZE rows reserves the exact same height a full
// page would take, rather than a guessed pixel value.
//
// Hidden below sm past the first one — reserving a full page's worth of
// blank height makes sense on desktop (keeps the panel from jumping
// between pages), but on a phone that's a lot of wasted scroll for pure
// spacing, so mobile only reserves room for 1 row.
function ArcRowPlaceholder({ index }: { index: number }) {
  return (
    <div className={`rounded-md overflow-hidden ${index === 0 ? "" : "hidden sm:block"}`} aria-hidden="true">
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
// Reordering is done with the Pointer Events API rather than native HTML5
// drag-and-drop — the native `draggable` attribute never fires drag events
// for touch input at all (it's mouse-only in every mobile browser), so it
// silently did nothing on a phone. Pointer events unify mouse and touch
// through one API. A drag can only start from the grip handle (not
// anywhere on the row) so the rest of the row stays normally
// touch-scrollable. Mirrors AdminChapterList exactly.
//
// Reorders commit on release, not incrementally on every pointer move —
// mutating the list (and therefore the DOM) mid-drag would reshuffle rows
// out from under the pointer while it's still mid-gesture. Tracking
// dragOverIndex separately keeps every row's position stable for the whole
// gesture; only the drop-target outline and the dragged row's own offset
// update until the actual release.
export default function AdminArcList({ mangaId, arcs, editingArcId, onToggleEdit }: AdminArcListProps) {
  const router = useRouter();
  const [ordered, setOrdered] = useState(() => arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  // Height of the row being dragged, captured once at pointer-down — used
  // to know how far its neighbors need to shift to visually "make room"
  // for it as it moves (see dragTargetOriginalIndex below). State (not a
  // ref) because it's read during render to compute each row's shift.
  // ROW_GAP_PX matches the list container's own `gap-3`; there's no DOM
  // way to read a flex gap back out, so it's a plain constant kept in sync
  // with the className below by hand.
  const [dragRowHeight, setDragRowHeight] = useState(0);

  const dragStartYRef = useRef(0);
  // Mirrors dragOverIndex for synchronous reads from the window listener
  // below — that listener only resubscribes when dragIndex changes (not on
  // every pointermove), so its pointerup/pointercancel closures would
  // otherwise see whatever dragOverIndex was at drag-start, not the latest
  // value.
  const dragOverIndexRef = useRef<number | null>(null);
  const rowRefs = useRef(new Map<number, HTMLDivElement>());

  // Re-sync with fresh server data (after router.refresh()) during render
  // rather than in an effect, which would paint one frame of the stale
  // order first (React's "adjusting state when a prop changes" pattern).
  const [prevArcs, setPrevArcs] = useState(arcs);
  if (arcs !== prevArcs) {
    setPrevArcs(arcs);
    setOrdered(arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
  }

  const displayNumbers = new Map<string, number>();
  let regularCounter = 0;
  for (const a of ordered) {
    if (!a.arc_is_ex) {
      regularCounter += 1;
      displayNumbers.set(a.id, regularCounter);
    }
  }

  // Search is a pure display filter over `ordered`, not a different data
  // source — reordering only ever operates on the full list (see
  // commitOrder), so drag-and-drop is turned off while filtered instead of
  // trying to make "drag position 2 of 3 filtered results" mean something
  // in the full arc order.
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;
  const filtered = isSearching
    ? ordered.filter((a) => {
        const number = a.arc_is_ex ? "ex" : `#${String(displayNumbers.get(a.id) ?? 0).padStart(3, "0")}`;
        return a.arc_name.toLowerCase().includes(query) || number.toLowerCase().includes(query);
      })
    : ordered;

  const totalCount = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const pageItems = isSearching ? filtered : ordered.slice(pageStart, pageStart + PAGE_SIZE);
  // Padding rows keep the list the same height from page to page — only
  // worth it when there IS more than one page; with a single page they
  // were just blank space under the last row.
  const placeholderCount = isSearching || totalCount <= PAGE_SIZE ? 0 : PAGE_SIZE - pageItems.length;

  async function commitOrder(nextOrdered: ArcItem[]): Promise<boolean> {
    const res = await fetch("/api/admin/arcs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manga_id: mangaId, ordered_ids: nextOrdered.map((a) => a.id) }),
    }).catch(() => null);

    if (res?.ok) {
      setOrdered(nextOrdered);
      router.refresh();
      return true;
    }

    // Snap back to the last known-good server order on failure, and say so.
    setOrdered(arcs.slice().sort((a, b) => a.arc_order - b.arc_order));
    void alertRequestFailed("Couldn't reorder arcs", res);
    return false;
  }

  // Returns where the dragged item would land among the OTHER rows, as a
  // position in that (N-1)-length list — i.e. "insert at this index after
  // removing the dragged one". Counting how many other rows have their
  // midpoint above the pointer gives that position directly. The dragged
  // row itself is excluded from the count (its own rect gets excluded, not
  // skipped-past) so that a pointer that hasn't actually crossed a
  // neighbor's midpoint yet — including one that hasn't moved at all —
  // resolves back to the row's own starting slot instead of drifting onto
  // a neighbor. (Previously this excluded the dragged row from the
  // candidate list without excluding it from the count, which meant even a
  // stationary pointer could resolve one slot off from where the drag
  // started — the "accidental drag reorders things without moving"
  // report.)
  function findOverIndex(clientY: number, currentDragIndex: number): number {
    const entries = [...rowRefs.current.entries()].sort((a, b) => a[0] - b[0]);
    let position = 0;
    for (const [idx, el] of entries) {
      if (idx === currentDragIndex) continue;
      const rect = el.getBoundingClientRect();
      if (clientY > rect.top + rect.height / 2) position++;
    }
    return position;
  }

  function handleGripPointerDown(e: React.PointerEvent<HTMLElement>, index: number) {
    e.preventDefault();
    dragStartYRef.current = e.clientY;
    setDragRowHeight(rowRefs.current.get(index)?.getBoundingClientRect().height ?? 0);
    dragOverIndexRef.current = index;
    setDragIndex(index);
    setDragOverIndex(index);
    setDragOffsetY(0);
    try {
      // Nice-to-have (keeps a mouse's "grabbing" cursor and hover states
      // pinned to the grip while dragging) but no longer load-bearing —
      // the window listeners below track the gesture regardless of
      // whether this succeeds.
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  }

  // Tracks the drag via window-level listeners instead of handlers on the
  // grip itself. A handler on the grip only keeps receiving events once
  // the pointer leaves it if setPointerCapture succeeded — on a real
  // touchscreen a fast finger movement off the small grip icon can outrun
  // or fail that capture, silently dropping the rest of the gesture
  // (the drag would start but never actually track or commit). Listening
  // on window sidesteps that: every pointermove/pointerup bubbles up to
  // window regardless of capture.
  useEffect(() => {
    if (dragIndex === null) return;

    function onMove(e: PointerEvent) {
      setDragOffsetY(e.clientY - dragStartYRef.current);
      const over = findOverIndex(e.clientY, dragIndex as number);
      dragOverIndexRef.current = over;
      setDragOverIndex(over);
    }

    function finishDrag() {
      const from = dragIndex as number;
      const to = dragOverIndexRef.current ?? from;
      setDragIndex(null);
      setDragOverIndex(null);
      setDragOffsetY(0);
      if (from === to) return;

      const next = ordered.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      commitOrder(next);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragIndex]);

  if (totalCount === 0) {
    return (
      <div className="relative">
        <div className="flex flex-col gap-3" aria-hidden="true">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ArcRowPlaceholder key={i} index={i} />
          ))}
        </div>
        <p className="absolute inset-0 flex items-center justify-center text-xs text-fg-muted">
          No arcs yet — create one above.
        </p>
      </div>
    );
  }

  // The original-index equivalent of dragOverIndex — "insert before this
  // original row" — used to work out which rows between the drag's start
  // and current position need to visually shift out of the way. See
  // findOverIndex for why dragOverIndex itself is in post-removal terms.
  const dragTargetOriginalIndex =
    dragIndex !== null && dragOverIndex !== null
      ? dragOverIndex < dragIndex
        ? dragOverIndex
        : dragOverIndex + 1
      : null;

  return (
    <div className="flex flex-col gap-3">
      {totalCount > PAGE_SIZE || isSearching ? (
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search arcs by number or title…" />
      ) : null}

      {isSearching && filtered.length === 0 && (
        <p className="text-xs text-fg-muted text-center py-6">No arcs match &quot;{search}&quot;.</p>
      )}

      {pageItems.map((a, localIndex) => {
        // Indexing into `ordered` (not `pageItems`/`filtered`) keeps drag
        // math correct — see the comment above `filtered`. Dragging is
        // disabled while searching (no gripHandle rendered below), so
        // `index` only needs to be meaningful in the non-searching path.
        const index = isSearching ? ordered.indexOf(a) : pageStart + localIndex;
        const isBeingEdited = editingArcId === a.id;
        const isDragging = !isSearching && dragIndex === index;

        // Real-time "auto sort" preview: rows between the drag's start and
        // current target slide out of the way by exactly one row's worth
        // of space, so the list visibly reflows around where the dragged
        // row will land — instead of just outlining a static target row.
        let dragShiftY = 0;
        if (!isDragging && dragIndex !== null && dragTargetOriginalIndex !== null) {
          const slot = dragRowHeight + ROW_GAP_PX;
          if (dragTargetOriginalIndex > dragIndex && index > dragIndex && index < dragTargetOriginalIndex) {
            dragShiftY = -slot;
          } else if (dragTargetOriginalIndex < dragIndex && index >= dragTargetOriginalIndex && index < dragIndex) {
            dragShiftY = slot;
          }
        }

        // The grip is rendered twice — once here for sm+ (beside the
        // cover), once passed into AdminArcRow to render inline inside
        // the card below sm (there's no cover there to sit beside). Both
        // copies share the same pointer-down handler for this row; move/up
        // tracking happens on window (see the effect above).
        const gripHandle = !isBeingEdited && !isSearching && (
          // px-2/-mx-2: a 32px-wide grab area (full row height) around the
          // 16px icon, without moving anything — the icon alone was a thin
          // strip to hit with a thumb
          <span
            className="flex items-center self-stretch px-2 -mx-2 cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={(e) => handleGripPointerDown(e, index)}
          >
            <GripVertical className="w-4 h-4" />
          </span>
        );

        return (
          <div
            key={a.id}
            ref={(el) => {
              if (el) rowRefs.current.set(index, el);
              else rowRefs.current.delete(index);
            }}
            style={
              isDragging
                ? { transform: `translateY(${dragOffsetY}px)`, zIndex: 50 }
                : dragShiftY !== 0
                  ? { transform: `translateY(${dragShiftY}px)` }
                  : undefined
            }
            className={`relative flex items-stretch gap-1.5 ${
              isDragging
                ? "shadow-lg scale-[1.02] bg-bg rounded-md"
                : "transition-transform duration-150 ease-out"
            }`}
          >
            {!isBeingEdited && (
              // Hidden below sm — there's no cover thumbnail there for it to
              // sit beside, so AdminArcRow renders its own copy inline,
              // inside the card, instead.
              <div className="hidden sm:flex items-center px-1 text-fg-muted hover:text-fg-secondary transition-colors duration-200">
                {gripHandle}
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
                dragHandle={gripHandle}
              />
            </div>
          </div>
        );
      })}

      {Array.from({ length: placeholderCount }).map((_, i) => (
        <ArcRowPlaceholder key={`placeholder-${i}`} index={i} />
      ))}

      {!isSearching && totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary disabled:opacity-40 disabled:hover:text-fg-secondary disabled:hover:border-border transition-colors duration-200"
          >
            Prev
          </button>
          <span className="text-xs text-fg-muted">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary disabled:opacity-40 disabled:hover:text-fg-secondary disabled:hover:border-border transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
