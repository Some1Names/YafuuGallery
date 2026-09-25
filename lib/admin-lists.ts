import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { formatUsername } from "@/lib/format-username";
import { formatChapterBadge, getChapterDisplayNumbers } from "@/lib/chapter-number";

// Server side of the paged Users / Comments lists on /admin and /manage.
// They used to load every user and every comment into the page up front
// and filter in the browser; now each list asks the API for one page at a
// time (ADMIN_PAGE_SIZE, "Show more" for the next), with search and the
// "Reported only" filter done in the database so they still cover
// everything, not just what's loaded.

export const ADMIN_PAGE_SIZE = 30;

type SessionUser = { id?: string; role?: string } | null | undefined;

// Which comments someone may moderate: admins all of them, authors only
// those on their own manga (same rule as canModerateComment). null = none.
export function commentScope(user: SessionUser): Prisma.CommentWhereInput | null {
  if (!user?.id) return null;
  if (user.role === "admin") return {};
  if (user.role === "author") return { chapter: { manga: { author_id: user.id } } };
  return null;
}

// Search people the way they're shown: "name#tag". "yafuu" matches the
// name, "yafuu#30" narrows by tag too, "#3021" matches the tag alone; the
// email is searched as well unless there's a "#".
export function userSearchWhere(q: string): Prisma.UserWhereInput {
  const query = q.trim();
  if (query.includes("#")) {
    const [namePart, tagPart] = query.split("#", 2).map((s) => s.trim());
    return {
      AND: [
        namePart ? { name: { contains: namePart, mode: "insensitive" } } : {},
        tagPart ? { tag: { startsWith: tagPart } } : {},
      ],
    };
  }
  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ],
  };
}

export interface AdminCommentItem {
  id: string;
  userId: string;
  body: string;
  userName: string;
  userTag: string | null;
  chapterId: string;
  chapterLabel: string;
  replyToName: string | null;
  createdAt: string;
  hidden: boolean;
  reportCount: number;
}

// One page of comments, newest first. `cursor` is the last comment id of
// the previous page. Search covers the text, the commenter (name#tag) and
// the manga title.
export async function loadCommentPage(opts: {
  scope: Prisma.CommentWhereInput;
  q?: string;
  reportedOnly?: boolean;
  userId?: string;
  cursor?: string | null;
}): Promise<{ items: AdminCommentItem[]; nextCursor: string | null }> {
  const q = opts.q?.trim();
  const where: Prisma.CommentWhereInput = {
    AND: [
      opts.scope,
      opts.userId ? { user_id: opts.userId } : {},
      opts.reportedOnly ? { reports: { some: {} } } : {},
      q
        ? {
            OR: [
              { body: { contains: q, mode: "insensitive" } },
              { user: userSearchWhere(q) },
              { chapter: { manga: { manga_title: { contains: q, mode: "insensitive" } } } },
            ],
          }
        : {},
    ],
  };

  const rows = await prisma.comment.findMany({
    where,
    // id breaks ties so the cursor order is stable
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    take: ADMIN_PAGE_SIZE + 1,
    ...(opts.cursor && { cursor: { id: opts.cursor }, skip: 1 }),
    select: {
      id: true,
      body: true,
      hidden_at: true,
      created_at: true,
      _count: { select: { reports: true } },
      user: { select: { id: true, name: true, tag: true } },
      parent: { select: { user: { select: { name: true, tag: true } } } },
      chapter: { select: { id: true, chapter_is_ex: true, manga_id: true, manga: { select: { manga_title: true } } } },
    },
  });
  const hasMore = rows.length > ADMIN_PAGE_SIZE;
  const page = rows.slice(0, ADMIN_PAGE_SIZE);

  // chapter_number is a sort key, not the number readers see — label with
  // the real display number (lib/chapter-number.ts), for just the manga on
  // this page.
  const mangaIds = [...new Set(page.map((c) => c.chapter.manga_id))];
  const siblings = mangaIds.length
    ? await prisma.chapter.findMany({
        where: { manga_id: { in: mangaIds } },
        select: { id: true, manga_id: true, chapter_number: true, chapter_is_ex: true },
      })
    : [];
  const displayNumbers = new Map(
    mangaIds.map((id) => [id, getChapterDisplayNumbers(siblings.filter((c) => c.manga_id === id))])
  );

  return {
    items: page.map((c) => ({
      id: c.id,
      userId: c.user.id,
      body: c.body,
      userName: c.user.name ?? "Unknown",
      userTag: c.user.tag,
      chapterId: c.chapter.id,
      chapterLabel: `${c.chapter.manga.manga_title} ${formatChapterBadge(
        c.chapter.chapter_is_ex,
        displayNumbers.get(c.chapter.manga_id)?.get(c.chapter.id)
      )}`,
      replyToName: c.parent ? formatUsername(c.parent.user.name, c.parent.user.tag) : null,
      createdAt: c.created_at.toISOString(),
      hidden: c.hidden_at !== null,
      reportCount: c._count.reports,
    })),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}

export interface AdminUserItem {
  id: string;
  name: string | null;
  tag: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  createdAt: string;
  commentCount: number;
}

// One page of users, newest first (admins only — the route checks).
export async function loadUserPage(opts: {
  q?: string;
  cursor?: string | null;
}): Promise<{ items: AdminUserItem[]; nextCursor: string | null }> {
  const q = opts.q?.trim();
  const rows = await prisma.user.findMany({
    where: q ? userSearchWhere(q) : undefined,
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    take: ADMIN_PAGE_SIZE + 1,
    ...(opts.cursor && { cursor: { id: opts.cursor }, skip: 1 }),
    select: {
      id: true,
      name: true,
      tag: true,
      email: true,
      role: true,
      created_at: true,
      _count: { select: { comments: true } },
    },
  });
  const hasMore = rows.length > ADMIN_PAGE_SIZE;
  const page = rows.slice(0, ADMIN_PAGE_SIZE);
  return {
    items: page.map((u) => ({
      id: u.id,
      name: u.name,
      tag: u.tag,
      email: u.email,
      role: u.role,
      createdAt: u.created_at.toISOString(),
      commentCount: u._count.comments,
    })),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}
