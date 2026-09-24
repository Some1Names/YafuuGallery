import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/comments/[id]/report — a signed-in reader flagging someone
// else's comment for moderation. It then shows up as "Reported" in the
// admin Comments tab and the manga author's /manage Comments tab.
// Idempotent: reporting the same comment twice keeps a single report.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to report comments." }, { status: 401 });
  }

  const { id } = await params;
  const reporterId = session.user.id;

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { user_id: true, hidden_at: true },
  });
  // Hidden comments aren't shown to readers, so they can't be reported.
  if (!comment || comment.hidden_at) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.user_id === reporterId) {
    return NextResponse.json({ error: "You can't report your own comment." }, { status: 400 });
  }

  await prisma.commentReport.upsert({
    where: { comment_id_reporter_id: { comment_id: id, reporter_id: reporterId } },
    create: { comment_id: id, reporter_id: reporterId },
    update: {},
  });

  return NextResponse.json({ reported: true });
}
