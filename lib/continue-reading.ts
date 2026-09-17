import { prisma } from "@/lib/prisma";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

export interface ContinueReadingItem {
  id: string;
  chapterId: string;
  displayNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  coverImageUrl: string | null;
  mangaTitle: string;
}

// Shared by the profile page and the home page's "Continue reading" strip —
// both just want "this user's N most recently progressed chapters," with
// each one's correctly-computed display number.
export async function getContinueReading(userId: string, limit: number): Promise<ContinueReadingItem[]> {
  const recentProgressRaw = await prisma.readingProgress.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
    take: limit,
    include: {
      chapter: {
        select: {
          chapter_number: true,
          chapter_is_ex: true,
          chapter_name: true,
          cover_image_url: true,
          manga: { select: { id: true, manga_title: true } },
        },
      },
    },
  });

  if (recentProgressRaw.length === 0) return [];

  // chapter_number is a 0-indexed sort key, not the number shown to
  // readers (see lib/chapter-number.ts) — the display number depends on
  // this chapter's position among its OWN manga's non-ex chapters, so
  // fetch each involved manga's full chapter list to compute it correctly.
  const progressMangaIds = [...new Set(recentProgressRaw.map((p) => p.chapter.manga.id))];
  const progressSiblingChapters = await prisma.chapter.findMany({
    where: { manga_id: { in: progressMangaIds } },
    select: { id: true, manga_id: true, chapter_number: true, chapter_is_ex: true },
  });
  const progressDisplayNumbers = new Map(
    progressMangaIds.map((mangaId) => [
      mangaId,
      getChapterDisplayNumbers(progressSiblingChapters.filter((c) => c.manga_id === mangaId)),
    ])
  );

  return recentProgressRaw.map((p) => ({
    id: p.id,
    chapterId: p.chapter_id,
    displayNumber: progressDisplayNumbers.get(p.chapter.manga.id)?.get(p.chapter_id) ?? 0,
    chapterIsEx: p.chapter.chapter_is_ex,
    chapterName: p.chapter.chapter_name,
    coverImageUrl: p.chapter.cover_image_url,
    mangaTitle: p.chapter.manga.manga_title,
  }));
}
