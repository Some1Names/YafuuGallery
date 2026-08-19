import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/manga — create
export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { manga_title, manga_synopsis, author_id } = body ?? {};

  if (!manga_title || !manga_synopsis || !author_id) {
    return NextResponse.json({ error: "manga_title, manga_synopsis, and author_id are required" }, { status: 400 });
  }

  const manga = await prisma.manga.create({
    data: { manga_title, manga_synopsis, author_id },
  });

  return NextResponse.json(manga, { status: 201 });
}