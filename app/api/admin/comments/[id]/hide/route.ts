import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canModerateComment } from "@/lib/manga-access";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Admins, or the author of the manga this comment was left on — so
  // authors can hide abuse on their own work without waiting on an admin.
  const session = await auth();
  if (!(await canModerateComment(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // comment_count counts VISIBLE comments, so hiding takes one off and
  // unhiding puts it back — in the same transaction as the toggle itself.
  const hiding = comment.hidden_at === null;
  const [updated] = await prisma.$transaction([
    prisma.comment.update({
      where: { id },
      data: { hidden_at: hiding ? new Date() : null },
    }),
    prisma.chapter.update({
      where: { id: comment.chapter_id },
      data: { comment_count: hiding ? { decrement: 1 } : { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ hidden: updated.hidden_at !== null });
}