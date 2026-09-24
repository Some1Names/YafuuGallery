import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_LENGTH = 2000;
const COMMENTS_PAGE_SIZE = 20;
// Replies loaded per thread. Far above what a thread here reaches; only a
// ceiling so one runaway thread can't make the response enormous.
const MAX_REPLIES_PER_THREAD = 200;

// The fields every comment (top-level or reply) comes back with. The
// likes/reports relations are filtered to the viewer's own row only — "did
// I like / report this", never the full list. "" never matches a real user
// id, so a signed-out viewer cleanly gets empty arrays without needing a
// differently-shaped select (which Prisma can't type-check as well).
function commentSelect(viewerId: string | undefined) {
  return {
    id: true,
    body: true,
    created_at: true,
    hidden_at: true,
    user: { select: { id: true, name: true, tag: true, image: true } },
    _count: { select: { likes: true } },
    likes: { where: { user_id: viewerId ?? "" }, select: { id: true } },
    reports: { where: { reporter_id: viewerId ?? "" }, select: { id: true } },
  } as const;
}

type CommentRow = {
  id: string;
  body: string;
  created_at: Date;
  hidden_at: Date | null;
  user: { id: string; name: string | null; tag: string | null; image: string | null };
  _count: { likes: number };
  likes: { id: string }[];
  reports: { id: string }[];
};

function toJson(c: CommentRow) {
  return {
    id: c.id,
    // a hidden comment only ever comes back as the placeholder at the top
    // of a thread that still has visible replies — its text stays private
    body: c.hidden_at ? "" : c.body,
    hidden: c.hidden_at !== null,
    created_at: c.created_at,
    user: c.user,
    likeCount: c._count.likes,
    likedByMe: c.likes.length > 0,
    reportedByMe: c.reports.length > 0,
  };
}

// Per user, across all chapters. Generous for real conversation, tight
// enough to stop a flood.
const COMMENT_RATE_LIMITS = [
  { windowMs: 60 * 1000, max: 5, label: "minute" },
  { windowMs: 60 * 60 * 1000, max: 30, label: "little while" },
] as const;

// GET /api/chapters/[id]/comments[?before=<commentId>] — public. Returns
// one page of threads: the newest COMMENTS_PAGE_SIZE top-level comments, or
// with `before`, the page just older than that comment. Each page comes
// back oldest-first (reads like a chat log, newest at the bottom), plus
// `hasMore` for the panel's "Show older comments" button. Every thread
// carries its visible replies, oldest first. Moderator-hidden comments
// never show — except a hidden top-level comment that still has visible
// replies, which comes back as a bodiless "hidden" placeholder so the
// replies keep their context.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const before = request.nextUrl.searchParams.get("before");
  const session = await auth();
  const viewerId = session?.user?.id;

  const rows = await prisma.comment.findMany({
    where: {
      chapter_id: id,
      parent_id: null,
      OR: [{ hidden_at: null }, { replies: { some: { hidden_at: null } } }],
    },
    // newest first so `take` grabs the most recent page; id breaks ties
    // between same-millisecond comments so the cursor order is stable
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    // one extra row just to learn whether an older page exists
    take: COMMENTS_PAGE_SIZE + 1,
    ...(before && { cursor: { id: before }, skip: 1 }),
    select: {
      ...commentSelect(viewerId),
      replies: {
        where: { hidden_at: null },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
        take: MAX_REPLIES_PER_THREAD,
        select: commentSelect(viewerId),
      },
    },
  });

  const hasMore = rows.length > COMMENTS_PAGE_SIZE;
  const page = rows.slice(0, COMMENTS_PAGE_SIZE).reverse();

  return NextResponse.json({
    comments: page.map((c) => ({ ...toJson(c), replies: c.replies.map(toJson) })),
    hasMore,
  });
}

// POST /api/chapters/[id]/comments — create, requires an account. Body:
// { body, parent_id? } — parent_id makes it a reply. The
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

  // A reply must point at a visible comment on this same chapter. Replying
  // to a reply joins that reply's thread (threads are one level deep).
  let parentId: string | null = null;
  if (requestBody?.parent_id !== undefined && requestBody?.parent_id !== null) {
    const parent =
      typeof requestBody.parent_id === "string"
        ? await prisma.comment.findUnique({
            where: { id: requestBody.parent_id },
            select: { id: true, chapter_id: true, parent_id: true, hidden_at: true },
          })
        : null;
    if (!parent || parent.chapter_id !== id || parent.hidden_at !== null) {
      return NextResponse.json({ error: "That comment isn't available to reply to." }, { status: 400 });
    }
    parentId = parent.parent_id ?? parent.id;
  }

  // Rate limit, so one account (or a script) can't flood a chapter.
  // Counted from the database rather than in memory: on serverless hosting
  // each request can land on a different instance, so an in-memory counter
  // would never see the burst. Indexed on (user_id, created_at).
  const now = Date.now();
  const [lastMinute, lastHour] = await Promise.all(
    COMMENT_RATE_LIMITS.map(({ windowMs }) =>
      prisma.comment.count({
        where: { user_id: session.user.id, created_at: { gt: new Date(now - windowMs) } },
      })
    )
  );
  const hit = [lastMinute, lastHour].findIndex((count, i) => count >= COMMENT_RATE_LIMITS[i].max);
  if (hit !== -1) {
    const { windowMs, label } = COMMENT_RATE_LIMITS[hit];
    return NextResponse.json(
      { error: `You're commenting too fast — please wait a ${label} and try again.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) } }
    );
  }

  try {
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { chapter_id: id, user_id: session.user.id, body: text, parent_id: parentId },
        select: {
          id: true,
          body: true,
          created_at: true,
          parent_id: true,
          user: { select: { id: true, name: true, tag: true, image: true } },
        },
      }),
      prisma.chapter.update({ where: { id }, data: { comment_count: { increment: 1 } } }),
    ]);

    // A brand-new comment has no likes yet — no need to query for it.
    return NextResponse.json(
      { ...comment, hidden: false, likeCount: 0, likedByMe: false, reportedByMe: false, replies: [] },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/chapters/[id]/comments]", err);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
