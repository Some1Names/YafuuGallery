import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // an admin can't delete their own account from this panel — avoids
  // accidentally locking yourself out mid-session
  if (id === session.user.id) {
    return NextResponse.json({ error: "You can't delete your own account here." }, { status: 400 });
  }

  // Manga.author has no onDelete rule (Restrict), so the database refuses
  // to delete anyone who still authors manga — that used to surface as a
  // bare 500 and a generic "Failed to delete user." Say why up front.
  const authoredCount = await prisma.manga.count({ where: { author_id: id } });
  if (authoredCount > 0) {
    return NextResponse.json(
      {
        error: `This user is the author of ${authoredCount} manga. Delete those manga first, then delete the user.`,
      },
      { status: 409 }
    );
  }

  // The last admin can't be deleted either, for the same reason the role
  // route won't demote them: nobody could get admin access back.
  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "admin" && (await prisma.user.count({ where: { role: "admin" } })) <= 1) {
    return NextResponse.json({ error: "Can't delete the last admin." }, { status: 400 });
  }

  // Deleting the user deletes their comments, and — through the reply
  // cascade — other people's replies to those comments. Chapter.comment_count
  // counts VISIBLE comments and isn't recomputed automatically, so take every
  // visible one that's about to disappear off its chapter in the same
  // transaction (this used to leave the counts too high, like the drift the
  // recount script repaired). Replies are grouped separately and exclude the
  // user's own, so nothing is subtracted twice.
  const [ownVisible, repliesToThem] = await Promise.all([
    prisma.comment.groupBy({
      by: ["chapter_id"],
      where: { user_id: id, hidden_at: null },
      _count: { _all: true },
    }),
    prisma.comment.groupBy({
      by: ["chapter_id"],
      where: { parent: { user_id: id }, user_id: { not: id }, hidden_at: null },
      _count: { _all: true },
    }),
  ]);
  const removedPerChapter = new Map<string, number>();
  for (const row of [...ownVisible, ...repliesToThem]) {
    removedPerChapter.set(row.chapter_id, (removedPerChapter.get(row.chapter_id) ?? 0) + row._count._all);
  }

  await prisma.$transaction([
    ...[...removedPerChapter].map(([chapterId, removed]) =>
      prisma.chapter.update({ where: { id: chapterId }, data: { comment_count: { decrement: removed } } })
    ),
    prisma.user.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}