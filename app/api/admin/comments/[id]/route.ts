import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/comments/[id] — permanent delete, distinct from the
// hide/unhide toggle (which is reversible and preserves the row)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { chapter_id: true, hidden_at: true },
  });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // comment_count counts VISIBLE comments — deleting one that was visible
  // takes it off the count (a hidden one was already excluded). This used
  // to never be decremented, so the chapter's comment badge drifted high.
  await prisma.$transaction([
    prisma.comment.delete({ where: { id } }),
    ...(comment.hidden_at === null
      ? [prisma.chapter.update({ where: { id: comment.chapter_id }, data: { comment_count: { decrement: 1 } } })]
      : []),
  ]);

  return NextResponse.json({ success: true });
}