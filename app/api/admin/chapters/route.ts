import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// `instanceof Prisma.PrismaClientKnownRequestError` doesn't reliably match
// here — Turbopack ends up with more than one instance of the generated
// client's module graph, so the class reference this file imports isn't
// always the same one the thrown error was constructed with. Checking the
// `code` property directly is what Prisma's own docs recommend for exactly
// this reason, and it isn't fooled by cross-module class identity.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
}

// POST /api/admin/chapters — create
export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { manga_id, arc_id, chapter_number, chapter_name, published_date } = body ?? {};

  if (!manga_id || chapter_number === undefined || chapter_number === null || !chapter_name || !published_date) {
    return NextResponse.json(
      { error: "manga_id, chapter_number, chapter_name, and published_date are required" },
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

  try {
    const chapter = await prisma.chapter.create({
      data: {
        manga_id,
        arc_id: arc_id || null,
        chapter_number: number,
        chapter_name,
        published_date: new Date(published_date),
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        { error: "This manga already has a chapter with that number." },
        { status: 409 }
      );
    }
    console.error("[POST /api/admin/chapters]", err);
    return NextResponse.json({ error: "Failed to create chapter." }, { status: 500 });
  }
}
