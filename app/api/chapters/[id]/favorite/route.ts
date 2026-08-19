import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/chapters/[id]/favorite
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id: chapterId } = await params;

  try {
    const existing = await prisma.chapterBookmark.findUnique({
      where: {
        user_id_chapter_id: {
          user_id: session.user.id,
          chapter_id: chapterId,
        },
      },
    });

    if (existing) {
      await prisma.chapterBookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    await prisma.chapterBookmark.create({
      data: { user_id: session.user.id, chapter_id: chapterId },
    });
    return NextResponse.json({ favorited: true });
  } catch (err) {
    console.error("[POST /api/chapters/[id]/favorite]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}