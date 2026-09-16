interface ChapterForNumbering {
  id: string;
  chapter_number: number;
  chapter_is_ex: boolean;
}

// chapter_number is purely a 0-indexed sort/position key across every
// chapter on a manga, "ex" ones included (see the reorder route) — it is
// NOT the number shown to readers. The number shown is "how many non-ex
// chapters come at or before this one," recomputed from scratch here, so
// dragging the ex chapter around never perturbs any regular chapter's
// displayed number. Mirrors AdminChapterList's admin-side version of the
// same computation.
export function getChapterDisplayNumbers<T extends ChapterForNumbering>(
  chapters: T[]
): Map<string, number> {
  const sorted = chapters.slice().sort((a, b) => a.chapter_number - b.chapter_number);
  const map = new Map<string, number>();
  let counter = 0;
  for (const c of sorted) {
    if (!c.chapter_is_ex) {
      counter += 1;
      map.set(c.id, counter);
    }
  }
  return map;
}

export function formatChapterBadge(isEx: boolean, displayNumber: number | undefined): string {
  return isEx ? "ex" : `#${String(displayNumber ?? 0).padStart(3, "0")}`;
}
