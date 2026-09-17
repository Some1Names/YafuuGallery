import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_LENGTH = 2000;

// GET /api/chapters/[id]/comments — public, oldest first (reads like a
// chat log). Admin-hidden comments (hidden_at set) never show up here —
// hiding still only happens through the admin moderation panel.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { chapter_id: id, hidden_at: null },
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      body: true,
      created_at: true,
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(comments);
}

// POST /api/chapters/[id]/comments — create, requires an account. The
// entry point (ChapterCommentPanel, gated by ChapterReaderClient) never
// lets a signed-out visitor reach this, but the check still lives here too
// since a client-side gate alone isn't real enforcement.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need an account to comment." }, { status: 401 });
  }

  const requestBody = await request.json().catch(() => null);
  const text = typeof requestBody?.body === "string" ? requestBody.body.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "Comment can't be empty." }, { status: 400 });
  }
  if (text.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Comment is too long (max ${MAX_BODY_LENGTH} characters).` },
      { status: 400 }
    );
  }

  try {
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { chapter_id: id, user_id: session.user.id, body: text },
        select: {
          id: true,
          body: true,
          created_at: true,
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.chapter.update({ where: { id }, data: { comment_count: { increment: 1 } } }),
    ]);

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/chapters/[id]/comments]", err);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
