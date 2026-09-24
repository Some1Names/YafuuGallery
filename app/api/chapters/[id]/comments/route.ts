import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_LENGTH = 2000;
const COMMENTS_PAGE_SIZE = 20;

// GET /api/chapters/[id]/comments[?before=<commentId>] — public. Returns
// one page: the newest COMMENTS_PAGE_SIZE comments, or with `before`, the
// page just older than that comment. Each page comes back oldest-first
// (reads like a chat log, newest at the bottom), plus `hasMore` for the
// panel's "Show older comments" button. Admin-hidden comments (hidden_at
// set) never show up here — hiding only happens through the admin panel.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const before = request.nextUrl.searchParams.get("before");
  const session = await auth();
  const viewerId = session?.user?.id;

  const rows = await prisma.comment.findMany({
    where: { chapter_id: id, hidden_at: null },
    // newest first so `take` grabs the most recent page; id breaks ties
    // between same-millisecond comments so the cursor order is stable
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    // one extra row just to learn whether an older page exists
    take: COMMENTS_PAGE_SIZE + 1,
    ...(before && { cursor: { id: before }, skip: 1 }),
    select: {
      id: true,
      body: true,
      created_at: true,
      user: { select: { id: true, name: true, tag: true, image: true } },
      _count: { select: { likes: true } },
      // Only ever matches the viewer's own like row (if any) — this is
      // just "did I like this," not the like list itself, so there's
      // never more than one row here. "" never matches a real user_id, so
      // a signed-out viewer cleanly gets an empty array without needing a
      // differently-shaped select (which Prisma can't type-check as well).
      likes: { where: { user_id: viewerId ?? "" }, select: { id: true } },
    },
  });

  const hasMore = rows.length > COMMENTS_PAGE_SIZE;
  const page = rows.slice(0, COMMENTS_PAGE_SIZE).reverse();

  return NextResponse.json({
    comments: page.map((c) => ({
      id: c.id,
      body: c.body,
      created_at: c.created_at,
      user: c.user,
      likeCount: c._count.likes,
      likedByMe: c.likes.length > 0,
    })),
    hasMore,
  });
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
          user: { select: { id: true, name: true, tag: true, image: true } },
        },
      }),
      prisma.chapter.update({ where: { id }, data: { comment_count: { increment: 1 } } }),
    ]);

    // A brand-new comment has no likes yet — no need to query for it.
    return NextResponse.json({ ...comment, likeCount: 0, likedByMe: false }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/chapters/[id]/comments]", err);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
