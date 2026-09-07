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

  if (!manga_title || !manga_synopsis) {
    return NextResponse.json({ error: "manga_title and manga_synopsis are required" }, { status: 400 });
  }

  const manga = await prisma.manga.create({
    data: {
      manga_title,
      manga_synopsis,
      // A manga's author is whoever creates it, not a separately assignable
      // field — no admin override, so this can't be spoofed via the body.
      author_id: session!.user!.id,
      cover_image_url: cover_image_url || null,
      banner_image_url: banner_image_url || null,
    },
  });

  return NextResponse.json(manga, { status: 201 });
}