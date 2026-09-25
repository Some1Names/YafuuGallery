import { NextRequest, NextResponse } from "next/server";
import { checkText, MAX_MANGA_TITLE_LENGTH, MAX_SYNOPSIS_LENGTH } from "@/lib/content-limits";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canCreateManga } from "@/lib/manga-access";
import { isAllowedUrlWrite } from "@/lib/storage";
import { isMangaStatus, parseGenres } from "@/lib/genres";

// POST /api/admin/manga — create
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!canCreateManga(session?.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { manga_title, manga_synopsis, cover_image_url, banner_image_url, genres, manga_status } = body ?? {};

  if (!manga_title || !manga_synopsis) {
    return NextResponse.json({ error: "manga_title and manga_synopsis are required" }, { status: 400 });
  }

  // type, blank and length checks (lib/content-limits.ts); stores trimmed text
  const title = checkText(manga_title, "Title", MAX_MANGA_TITLE_LENGTH);
  if ("error" in title) return NextResponse.json({ error: title.error }, { status: 400 });
  const synopsis = checkText(manga_synopsis, "Synopsis", MAX_SYNOPSIS_LENGTH);
  if ("error" in synopsis) return NextResponse.json({ error: synopsis.error }, { status: 400 });

  // SECURITY: see isAllowedUrlWrite — whatever URLs are stored here get
  // deleted from R2 when this manga is later deleted or its images replaced.
  if (
    !isAllowedUrlWrite(cover_image_url, session!.user!.id) ||
    !isAllowedUrlWrite(banner_image_url, session!.user!.id)
  ) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const manga = await prisma.manga.create({
    data: {
      manga_title: title.value,
      manga_synopsis: synopsis.value,
      // A manga's author is whoever creates it, not a separately assignable
      // field — no admin override, so this can't be spoofed via the body.
      author_id: session!.user!.id,
      cover_image_url: cover_image_url || null,
      banner_image_url: banner_image_url || null,
      // unknown genre slugs are dropped, not rejected (see lib/genres.ts)
      genres: parseGenres(genres),
      manga_status: isMangaStatus(manga_status) ? manga_status : "ongoing",
    },
  });

  return NextResponse.json(manga, { status: 201 });
}