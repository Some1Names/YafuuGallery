import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageManga } from "@/lib/manga-access";

// `instanceof Prisma.PrismaClientKnownRequestError` doesn't reliably match
// here — Turbopack ends up with more than one instance of the generated
// client's module graph, so the class reference this file imports isn't
// always the same one the thrown error was constructed with. Checking the
// `code` property directly is what Prisma's own docs recommend for exactly
// this reason, and it isn't fooled by cross-module class identity.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
}

const VALID_LANGUAGES = ["th", "en", "ja"] as const;
type TranslationLanguage = (typeof VALID_LANGUAGES)[number];

function parseLanguage(value: unknown): TranslationLanguage {
  return VALID_LANGUAGES.includes(value as TranslationLanguage) ? (value as TranslationLanguage) : "en";
}

// POST /api/admin/chapters — create
export async function POST(request: NextRequest) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const {
    manga_id,
    arc_id,
    chapter_number,
    chapter_name,
    published_date,
    cover_image_url,
    chapter_is_ex,
    pdf_url,
    pdf_file_name,
    pdf_language,
  } = body ?? {};

  if (!manga_id || chapter_number === undefined || chapter_number === null || !chapter_name || !published_date) {
    return NextResponse.json(
      { error: "manga_id, chapter_number, chapter_name, and published_date are required" },
      { status: 400 }
    );
  }

  if (!(await canManageManga(session?.user, manga_id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const chapter = await prisma.chapter.create({
      data: {
        manga_id,
        arc_id: arc_id || null,
        chapter_number: number,
        chapter_is_ex: isEx,
        chapter_name,
        published_date: new Date(published_date),
        cover_image_url: cover_image_url || null,
      },
    });

    // Translation is keyed on chapter+language, so each language tag gets
    // its own row — the admin picks which language a given PDF is when
    // uploading it (AdminPdfUploadButton), defaulting to "en" if omitted.
    if (pdf_url) {
      await prisma.translation.create({
        data: {
          chapter_id: chapter.id,
          language: parseLanguage(pdf_language),
          file_url: pdf_url,
          file_name: pdf_file_name ?? null,
          translator_id: session?.user?.id ?? null,
        },
      });
    }

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
