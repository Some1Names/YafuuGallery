"use client";

import AdminChapterRow from "./AdminChapterRow";
import { useState } from "react";

interface ChapterItem {
  id: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
}

interface AdminChapterListProps {
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

// Chapters paginate the same way arcs do, but there's no drag-to-reorder
// here: chapter_number is a real, often non-contiguous value (specials,
// seasons, renumbers — see "#026" in real data), unlike an arc's plain
// 1..N position. Auto-renumbering on drop would silently corrupt that
// numbering, so reordering only ever happens by editing the number
// directly (with the API's existing "already has a chapter with that
// number" 409 as the safety net against collisions).
export default function AdminChapterList({ chapters, arcs, editingChapterId, onToggleEdit }: AdminChapterListProps) {
  const [page, setPage] = useState(0);

  const sorted = chapters.slice().sort((a, b) => a.chapterNumber - b.chapterNumber);
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const pageItems = sorted.slice(pageStart, pageStart + PAGE_SIZE);
  const placeholderCount = PAGE_SIZE - pageItems.length;

  if (totalCount === 0) {
    return (
      <div className="relative">
        <div className="flex flex-col gap-2" aria-hidden="true">
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
    <div className="flex flex-col gap-2">
      {pageItems.map((c) => (
        <AdminChapterRow
          key={c.id}
          id={c.id}
          arcId={c.arcId}
          arcName={c.arcName}
          chapterNumber={c.chapterNumber}
          chapterName={c.chapterName}
          publishedDate={c.publishedDate}
          coverImageUrl={c.coverImageUrl}
          arcs={arcs}
          isEditing={editingChapterId === c.id}
          onToggleEdit={() => onToggleEdit(c.id)}
        />
      ))}

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
