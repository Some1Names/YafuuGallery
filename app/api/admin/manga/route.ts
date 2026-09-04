import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canCreateManga } from "@/lib/manga-access";

// POST /api/admin/manga — create
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!canCreateManga(session?.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { manga_title, manga_synopsis, cover_image_url, banner_image_url } = body ?? {};
  // Admins pick the author from a dropdown; authors can only ever publish
  // under their own name, so the client-submitted author_id is ignored for
  // that role instead of trusted.
  const author_id = session!.user!.role === "admin" ? body?.author_id : session!.user!.id;

  if (!manga_title || !manga_synopsis || !author_id) {
    return NextResponse.json({ error: "manga_title, manga_synopsis, and author_id are required" }, { status: 400 });
  }

  const manga = await prisma.manga.create({
    data: {
      manga_title,
      manga_synopsis,
      author_id,
      cover_image_url: cover_image_url || null,
      banner_image_url: banner_image_url || null,
    },
  });

  return NextResponse.json(manga, { status: 201 });
}