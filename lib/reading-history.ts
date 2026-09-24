import { prisma } from "@/lib/prisma";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

export interface ReadingHistoryItem {
  chapterId: string;
  mangaId: string;
  mangaTitle: string;
  mangaCoverUrl: string | null;
  chapterIsEx: boolean;
  displayNumber: number;
  chapterName: string;
  // last page the reader saved (0 = opened but no position saved yet)
  lastPage: number;
  completed: boolean;
  readAt: Date;
}

// /history: every chapter this reader has opened (one ReadingProgress row
// each), most recent first. Unlike Continue Reading (lib/continue-reading.ts),
// nothing is collapsed per manga — it's the full list. `limit + 1` rows are
// fetched so the caller can tell whether there's another page (see
// lib/pagination.ts).
export async function getReadingHistory(userId: string, limit: number): Promise<ReadingHistoryItem[]> {
  const rows = await prisma.readingProgress.findMany({
    where: { user_id: userId },
    // id breaks ties so paging is stable when two rows share a timestamp
    orderBy: [{ updated_at: "desc" }, { id: "desc" }],
    take: limit + 1,
    select: {
      last_page_read: true,
      completed: true,
      updated_at: true,
      chapter: {
        select: {
          id: true,
          chapter_is_ex: true,
          chapter_name: true,
          manga: { select: { id: true, manga_title: true, cover_image_url: true } },
        },
      },
    },
  });
  if (rows.length === 0) return [];

  // chapter_number is a sort key, not the number readers see — display
  // numbers need each manga's whole chapter list (lib/chapter-number.ts)
  const mangaIds = [...new Set(rows.map((r) => r.chapter.manga.id))];
  const siblings = await prisma.chapter.findMany({
    where: { manga_id: { in: mangaIds } },
    select: { id: true, manga_id: true, chapter_number: true, chapter_is_ex: true },
  });
  const displayNumbers = new Map(
    mangaIds.map((id) => [id, getChapterDisplayNumbers(siblings.filter((c) => c.manga_id === id))])
  );

  return rows.map((r) => ({
    chapterId: r.chapter.id,
    mangaId: r.chapter.manga.id,
    mangaTitle: r.chapter.manga.manga_title,
    mangaCoverUrl: r.chapter.manga.cover_image_url,
    chapterIsEx: r.chapter.chapter_is_ex,
    displayNumber: displayNumbers.get(r.chapter.manga.id)?.get(r.chapter.id) ?? 0,
    chapterName: r.chapter.chapter_name,
    lastPage: r.last_page_read,
    completed: r.completed,
    readAt: r.updated_at,
  }));
}
