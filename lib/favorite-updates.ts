import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

// "New chapter" = a chapter of a manga this reader has favorited, uploaded
// after they last caught up on that manga (Bookmark.updates_seen_at —
// favoriting time, or the last "Mark all as read"), that they haven't
// opened yet. Opening it (a ReadingProgress row) clears it one chapter at
// a time. Uses created_at, the real upload time, not published_date — that
// one is a calendar date the author picks and can be backdated.

async function newChapterWhere(userId: string): Promise<Prisma.ChapterWhereInput | null> {
  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: userId },
    select: { manga_id: true, updates_seen_at: true },
  });
  if (bookmarks.length === 0) return null;
  return {
    OR: bookmarks.map((b) => ({ manga_id: b.manga_id, created_at: { gt: b.updates_seen_at } })),
    reading_progress: { none: { user_id: userId } },
  };
}

// Per-manga counts of new chapters (manga with none are left out).
export async function getNewChapterCounts(userId: string): Promise<Map<string, number>> {
  const where = await newChapterWhere(userId);
  if (!where) return new Map();
  const rows = await prisma.chapter.groupBy({ by: ["manga_id"], where, _count: { _all: true } });
  return new Map(rows.map((r) => [r.manga_id, r._count._all]));
}

// Total across all favorites — the navbar's Favorites dot.
export async function getNewChapterTotal(userId: string): Promise<number> {
  const where = await newChapterWhere(userId);
  return where ? prisma.chapter.count({ where }) : 0;
}

export interface FavoriteUpdateItem {
  chapterId: string;
  mangaId: string;
  mangaTitle: string;
  mangaCoverUrl: string | null;
  chapterIsEx: boolean;
  displayNumber: number;
  chapterName: string;
  uploadedAt: Date;
  isNew: boolean;
}

// The Updates feed: the latest chapters across every favorited manga,
// newest upload first — read or not, so it doubles as a "what came out
// lately" list. `limit + 1` rows are fetched so the caller can tell
// whether there's another page (see lib/pagination.ts).
export async function getFavoriteUpdates(userId: string, limit: number): Promise<FavoriteUpdateItem[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: userId },
    select: { manga_id: true, updates_seen_at: true },
  });
  if (bookmarks.length === 0) return [];
  const seenAt = new Map(bookmarks.map((b) => [b.manga_id, b.updates_seen_at]));
  const mangaIds = [...seenAt.keys()];

  const [chapters, siblings] = await Promise.all([
    prisma.chapter.findMany({
      where: { manga_id: { in: mangaIds } },
      orderBy: [{ created_at: "desc" }, { chapter_number: "desc" }],
      take: limit + 1,
      select: {
        id: true,
        manga_id: true,
        chapter_is_ex: true,
        chapter_name: true,
        created_at: true,
        manga: { select: { manga_title: true, cover_image_url: true } },
        reading_progress: { where: { user_id: userId }, select: { id: true }, take: 1 },
      },
    }),
    // chapter_number is a sort key, not the number readers see — display
    // numbers need each manga's whole chapter list (lib/chapter-number.ts)
    prisma.chapter.findMany({
      where: { manga_id: { in: mangaIds } },
      select: { id: true, manga_id: true, chapter_number: true, chapter_is_ex: true },
    }),
  ]);

  const displayNumbers = new Map(
    mangaIds.map((id) => [id, getChapterDisplayNumbers(siblings.filter((c) => c.manga_id === id))])
  );

  return chapters.map((c) => {
    const seen = seenAt.get(c.manga_id);
    return {
      chapterId: c.id,
      mangaId: c.manga_id,
      mangaTitle: c.manga.manga_title,
      mangaCoverUrl: c.manga.cover_image_url,
      chapterIsEx: c.chapter_is_ex,
      displayNumber: displayNumbers.get(c.manga_id)?.get(c.id) ?? 0,
      chapterName: c.chapter_name,
      uploadedAt: c.created_at,
      isNew: seen !== undefined && c.created_at > seen && c.reading_progress.length === 0,
    };
  });
}
