import { prisma } from "@/lib/prisma";

type SessionUser = { id: string; role: string } | null | undefined;

// Admins can touch any manga; authors only their own. Used both to gate
// creating a new manga and to check ownership of an existing one before
// letting a PATCH/DELETE through.
export function canCreateManga(user: SessionUser): boolean {
  return user?.role === "admin" || user?.role === "author";
}

export async function canManageManga(user: SessionUser, mangaId: string): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "author") return false;
  const manga = await prisma.manga.findUnique({ where: { id: mangaId }, select: { author_id: true } });
  return manga?.author_id === user.id;
}

export async function canManageArc(user: SessionUser, arcId: string): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "author") return false;
  const arc = await prisma.arc.findUnique({ where: { id: arcId }, select: { manga: { select: { author_id: true } } } });
  return arc?.manga.author_id === user.id;
}

// Hiding/unhiding a comment: admins anywhere, authors only on comments
// left on their OWN manga's chapters. (Permanently deleting a comment
// stays admin-only — see /api/admin/comments/[id].)
export async function canModerateComment(user: SessionUser, commentId: string): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "author") return false;
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { chapter: { select: { manga: { select: { author_id: true } } } } },
  });
  return comment?.chapter.manga.author_id === user.id;
}

export async function canManageChapter(user: SessionUser, chapterId: string): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "author") return false;
  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId }, select: { manga: { select: { author_id: true } } } });
  return chapter?.manga.author_id === user.id;
}
