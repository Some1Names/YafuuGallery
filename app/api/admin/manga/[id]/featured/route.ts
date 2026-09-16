import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/manga/[id]/featured — toggle the home page carousel flag
//
// Admin-only, deliberately not the author-inclusive canManageManga check
// used by the rest of the manga admin routes — ManageMangaDashboard reuses
// AdminMangaRow for authors managing their own manga, and featured
// placement shouldn't be something an author can grant themselves.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const is_featured = body?.is_featured;
  if (typeof is_featured !== "boolean") {
    return NextResponse.json({ error: "is_featured (boolean) is required" }, { status: 400 });
  }

  // Turning it on appends to the end of the carousel order; turning it off
  // just clears the flag (featured_order is meaningless while unfeatured).
  const data = is_featured
    ? {
        is_featured: true,
        featured_order: ((await prisma.manga.aggregate({ _max: { featured_order: true } }))._max
          .featured_order ?? 0) + 1,
      }
    : { is_featured: false };

  const manga = await prisma.manga.update({ where: { id }, data });

  return NextResponse.json(manga);
}
