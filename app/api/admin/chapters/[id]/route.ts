import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageChapter } from "@/lib/manga-access";

// `instanceof Prisma.PrismaClientKnownRequestError` doesn't reliably match
// here — Turbopack ends up with more than one instance of the generated
// client's module graph, so the class reference this file imports isn't
// always the same one the thrown error was constructed with. Checking the
// `code` property directly is what Prisma's own docs recommend for exactly
// this reason, and it isn't fooled by cross-module class identity.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
}

// PATCH /api/admin/chapters/[id] — update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageChapter(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { arc_id, chapter_number, chapter_name, published_date, cover_image_url, chapter_is_ex } = body ?? {};

  if (chapter_number === undefined || chapter_number === null || !chapter_name || !published_date) {
    return NextResponse.json(
      { error: "chapter_number, chapter_name, and published_date are required" },
      { status: 400 }
    );
  }

  const number = Number(chapter_number);
  if (!Number.isInteger(number) || number < 0) {
    return NextResponse.json(
      { error: "chapter_number must be a whole number, 0 or higher" },
      { status: 400 }
    );
  }

  const isEx = chapter_is_ex === true;

  if (isEx) {
    const chapter = await prisma.chapter.findUnique({ where: { id }, select: { manga_id: true } });
    const existingEx = chapter
      ? await prisma.chapter.findFirst({
          where: { manga_id: chapter.manga_id, chapter_is_ex: true, id: { not: id } },
          select: { id: true },
        })
      : null;
    if (existingEx) {
      return NextResponse.json(
        { error: "This manga already has a special (ex) chapter." },
        { status: 409 }
      );
    }
  }

  try {
    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        arc_id: arc_id || null,
        chapter_number: number,
        chapter_is_ex: isEx,
        chapter_name,
        published_date: new Date(published_date),
        cover_image_url: cover_image_url || null,
      },
    });

    return NextResponse.json(chapter);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        { error: "This manga already has a chapter with that number." },
        { status: 409 }
      );
    }
    console.error("[PATCH /api/admin/chapters/[id]]", err);
    return NextResponse.json({ error: "Failed to update chapter." }, { status: 500 });
  }
}

// DELETE /api/admin/chapters/[id] — delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageChapter(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.chapter.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
