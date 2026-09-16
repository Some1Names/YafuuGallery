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
  const {
    arc_id,
    chapter_number,
    chapter_name,
    published_date,
    cover_image_url,
    chapter_is_ex,
    pdf_url,
    pdf_file_name,
  } = body ?? {};

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

    // No multi-language UI yet — every uploaded PDF is filed as the "en"
    // translation for now, one per chapter. The schema already supports
    // more languages per chapter (Translation is keyed on chapter+language)
    // for whenever that's actually needed.
    if (pdf_url) {
      await prisma.translation.upsert({
        where: { chapter_id_language: { chapter_id: id, language: "en" } },
        create: {
          chapter_id: id,
          language: "en",
          file_url: pdf_url,
          file_name: pdf_file_name ?? null,
          translator_id: session?.user?.id ?? null,
        },
        update: {
          file_url: pdf_url,
          file_name: pdf_file_name ?? null,
          translator_id: session?.user?.id ?? null,
        },
      });
    }

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
