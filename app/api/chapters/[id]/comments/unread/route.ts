import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chapters/[id]/comments/unread[?since=<ISO timestamp>]
// Count of visible comments on this chapter posted AFTER `since` — the
// newest comment this reader has already seen (the reader's comment
// badge keeps that per chapter in localStorage). No `since` = they've
// never opened this chapter's comments, so every visible comment is new.
// The viewer's own comments never count as new to them.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sinceParam = request.nextUrl.searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : null;
  if (since && Number.isNaN(since.getTime())) {
    return NextResponse.json({ error: "since must be an ISO timestamp" }, { status: 400 });
  }

  const session = await auth();
  const viewerId = session?.user?.id;

  const count = await prisma.comment.count({
    where: {
      chapter_id: id,
      hidden_at: null,
      ...(since && { created_at: { gt: since } }),
      ...(viewerId && { user_id: { not: viewerId } }),
    },
  });

  return NextResponse.json({ count });
}
