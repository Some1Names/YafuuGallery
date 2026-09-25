import { NextRequest, NextResponse } from "next/server";
import { checkText, MAX_MANGA_TITLE_LENGTH, MAX_SYNOPSIS_LENGTH } from "@/lib/content-limits";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageManga } from "@/lib/manga-access";
import { deleteReplacedUrls, deleteUrls, isAllowedUrlWrite } from "@/lib/storage";
import { isMangaStatus, parseGenres } from "@/lib/genres";

// PATCH /api/admin/manga/[id] — update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageManga(session?.user, id))) {
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

  // Grabbed before the update so a replaced cover/banner's old R2 object
  // can be deleted afterward instead of lingering as an orphan.
  const previous = await prisma.manga.findUnique({
    where: { id },
    select: { cover_image_url: true, banner_image_url: true },
  });

  // SECURITY: see isAllowedUrlWrite — replaced URLs get deleted from R2,
  // so new ones must be the editor's own uploads (or unchanged/cleared).
  const current = [previous?.cover_image_url, previous?.banner_image_url];
  if (
    !isAllowedUrlWrite(cover_image_url, session!.user!.id, current) ||
    !isAllowedUrlWrite(banner_image_url, session!.user!.id, current)
  ) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const manga = await prisma.manga.update({
    where: { id },
    data: {
      manga_title: title.value,
      manga_synopsis: synopsis.value,
      ...(cover_image_url !== undefined ? { cover_image_url: cover_image_url || null } : {}),
      ...(banner_image_url !== undefined ? { banner_image_url: banner_image_url || null } : {}),
      // Left as-is when omitted, like the images above.
      ...(genres !== undefined ? { genres: parseGenres(genres) } : {}),
      ...(isMangaStatus(manga_status) ? { manga_status } : {}),
    },
  });

  if (previous) {
    await deleteReplacedUrls([
      { oldUrl: previous.cover_image_url, newUrl: cover_image_url !== undefined ? cover_image_url || null : undefined },
      { oldUrl: previous.banner_image_url, newUrl: banner_image_url !== undefined ? banner_image_url || null : undefined },
    ]);
  }

  return NextResponse.json(manga);
}

// DELETE /api/admin/manga/[id] — delete
// Cascades to Arc/Chapter/Translation/Bookmark per the schema's
// onDelete: Cascade — deleting a manga wipes its whole chapter tree, not
// just the manga row. Every *_url anywhere in that tree is gathered
// before the delete so their R2 objects can be removed too, instead of
// leaving them as orphans.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageManga(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const manga = await prisma.manga.findUnique({
    where: { id },
    select: {
      cover_image_url: true,
      banner_image_url: true,
      arcs: { select: { arc_image_url: true } },
      chapters: { select: { cover_image_url: true, translations: { select: { file_url: true } } } },
    },
  });

  await prisma.manga.delete({ where: { id } });

  if (manga) {
    await deleteUrls([
      manga.cover_image_url,
      manga.banner_image_url,
      ...manga.arcs.map((a) => a.arc_image_url),
      ...manga.chapters.map((c) => c.cover_image_url),
      ...manga.chapters.flatMap((c) => c.translations.map((t) => t.file_url)),
    ]);
  }

  return NextResponse.json({ success: true });
}