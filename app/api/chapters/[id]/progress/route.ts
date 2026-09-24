import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Generous ceiling for a page number — a real chapter is a few dozen
// pages; this only exists so the client can't write absurd values.
const MAX_PAGE = 10_000;

// POST /api/chapters/[id]/progress — the reader saving where it's got to
// ({ page, completed }), so reopening the chapter resumes on that page
// (viewer/[id]/page.tsx reads it back) and a finished chapter can move
// "Continue" on to the next one. Signed-in readers only; signed-out
// reading just isn't tracked.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const page = body?.page;
  const completed = body?.completed === true;

  if (!Number.isInteger(page) || page < 1 || page > MAX_PAGE) {
    return NextResponse.json({ error: "page must be a whole number, 1 or higher" }, { status: 400 });
  }

  const chapter = await prisma.chapter.findUnique({ where: { id }, select: { id: true } });
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const userId = session.user.id;
  await prisma.readingProgress.upsert({
    where: { user_id_chapter_id: { user_id: userId, chapter_id: id } },
    create: { user_id: userId, chapter_id: id, last_page_read: page, completed },
    // `completed` only ever turns ON here — scrolling back up through a
    // chapter you've finished shouldn't un-finish it.
    update: { last_page_read: page, ...(completed && { completed: true }) },
  });

  return NextResponse.json({ success: true });
}
