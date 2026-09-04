import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

// PATCH /api/admin/manga/[id] — update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const { manga_title, manga_synopsis, cover_image_url, banner_image_url } = body ?? {};

  if (!manga_title || !manga_synopsis) {
    return NextResponse.json({ error: "manga_title and manga_synopsis are required" }, { status: 400 });
  }

  const manga = await prisma.manga.update({
    where: { id },
    data: {
      manga_title,
      manga_synopsis,
      ...(cover_image_url !== undefined ? { cover_image_url: cover_image_url || null } : {}),
      ...(banner_image_url !== undefined ? { banner_image_url: banner_image_url || null } : {}),
    },
  });

  return NextResponse.json(manga);
}

// DELETE /api/admin/manga/[id] — delete
// Cascades to Arc/Chapter/Bookmark per the schema's onDelete: Cascade —
// deleting a manga wipes its whole chapter tree, not just the manga row.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.manga.delete({ where: { id } });

  return NextResponse.json({ success: true });
}