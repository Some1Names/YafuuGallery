import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/comments/[id]/like — toggle, same pattern as the manga/chapter
// favorite routes: delete if it already exists, create if it doesn't.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id: commentId } = await params;

  try {
    const existing = await prisma.commentLike.findUnique({
      where: { user_id_comment_id: { user_id: session.user.id, comment_id: commentId } },
    });

    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.commentLike.create({
        data: { user_id: session.user.id, comment_id: commentId },
      });
    }

    const likeCount = await prisma.commentLike.count({ where: { comment_id: commentId } });

    return NextResponse.json({ liked: !existing, likeCount });
  } catch (err) {
    console.error("[POST /api/comments/[id]/like]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
