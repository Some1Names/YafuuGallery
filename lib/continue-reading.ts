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
  // true when the reader finished the chapter they last opened and this is
  // the one after it — the card labels it "Up next"
  isNext: boolean;
}

// How many recent progress rows to look through to fill `limit` cards —
// several rows usually belong to the same manga (read #1, #2, #3…) and
// collapse into one card.
const ROWS_PER_CARD = 5;
const MAX_ROWS = 100;

// Shared by the profile page and the home page's "Continue reading" strip:
// one card per manga, for the N manga this reader touched most recently.
// Each card is where to pick up — the last chapter they opened if they
// stopped partway, or the NEXT chapter if they read it to the end (same
// rule as the manga page's Continue button). A manga they've finished up
// to its latest chapter is left out: there's nothing to continue until a
// new chapter comes out, and linking the finished chapter would just
// restart it from page 1.
export async function getContinueReading(userId: string, limit: number): Promise<ContinueReadingItem[]> {
  const recentProgressRaw = await prisma.readingProgress.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
    take: Math.min(limit * ROWS_PER_CARD, MAX_ROWS),
    select: {
      id: true,
      chapter_id: true,
      completed: true,
      chapter: { select: { manga: { select: { id: true, manga_title: true } } } },
    },
  });

  // most recent row per manga (rows are already newest first)
  const latestPerManga = new Map<string, (typeof recentProgressRaw)[number]>();
  for (const p of recentProgressRaw) {
    if (!latestPerManga.has(p.chapter.manga.id)) latestPerManga.set(p.chapter.manga.id, p);
  }
  if (latestPerManga.size === 0) return [];

  // chapter_number is a 0-indexed sort key, not the number shown to
  // readers (see lib/chapter-number.ts) — both the "next chapter" and the
  // display number depend on each manga's full, ordered chapter list.
  const mangaIds = [...latestPerManga.keys()];
  const siblings = await prisma.chapter.findMany({
    where: { manga_id: { in: mangaIds } },
    orderBy: { chapter_number: "asc" },
    select: {
      id: true,
      manga_id: true,
      chapter_number: true,
      chapter_is_ex: true,
      chapter_name: true,
      cover_image_url: true,
    },
  });

  const items: ContinueReadingItem[] = [];
  for (const [mangaId, p] of latestPerManga) {
    const chapters = siblings.filter((c) => c.manga_id === mangaId);
    const idx = chapters.findIndex((c) => c.id === p.chapter_id);
    if (idx === -1) continue;
    const target = p.completed ? chapters[idx + 1] : chapters[idx];
    if (!target) continue; // finished the latest chapter — caught up
    items.push({
      id: p.id,
      chapterId: target.id,
      displayNumber: getChapterDisplayNumbers(chapters).get(target.id) ?? 0,
      chapterIsEx: target.chapter_is_ex,
      chapterName: target.chapter_name,
      coverImageUrl: target.cover_image_url,
      mangaTitle: p.chapter.manga.manga_title,
      isNext: p.completed,
    });
    if (items.length === limit) break;
  }
  return items;
}
