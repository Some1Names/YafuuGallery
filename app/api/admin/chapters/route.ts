import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PUBLISHED_DATE_ERROR, parsePublishedDate } from "@/lib/dates";
import { canManageManga } from "@/lib/manga-access";
import { isAllowedUrlWrite } from "@/lib/storage";

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

interface TranslationInput {
  language: TranslationLanguage;
  file_url: string;
  file_name: string | null;
}

// Normalizes the client's `translations` array into one entry per language
// (last one wins on an accidental duplicate — the UI already prevents
// picking the same language twice, this is just a server-side backstop)
// and drops anything without a file, so an empty/unfinished slot the admin
// added but never uploaded to is silently ignored rather than erroring.
function parseTranslations(value: unknown): TranslationInput[] {
  if (!Array.isArray(value)) return [];
  const byLanguage = new Map<TranslationLanguage, TranslationInput>();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const url = "url" in entry ? entry.url : undefined;
    if (typeof url !== "string" || !url) continue;
    const language = parseLanguage("language" in entry ? entry.language : undefined);
    const file_name = "file_name" in entry && typeof entry.file_name === "string" ? entry.file_name : null;
    byLanguage.set(language, { language, file_url: url, file_name });
  }
  return [...byLanguage.values()];
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
    translations: translationsInput,
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

  // A real calendar date in a sane range — new Date() alone let a blank
  // or zero value through as 1969-12-31 / 1970-01-01 (see lib/dates.ts).
  const publishedDate = parsePublishedDate(published_date);
  if (!publishedDate) {
    return NextResponse.json({ error: PUBLISHED_DATE_ERROR }, { status: 400 });
  }

  const number = Number(chapter_number);
  if (!Number.isInteger(number) || number < 0) {
    return NextResponse.json(
      { error: "chapter_number must be a whole number, 0 or higher" },
      { status: 400 }
    );
  }

  const isEx = chapter_is_ex === true;
  const translations = parseTranslations(translationsInput);

  // SECURITY: see isAllowedUrlWrite — whatever URLs are stored here get
  // deleted from R2 when this chapter is later deleted or edited.
  const editorId = session!.user!.id;
  if (
    !isAllowedUrlWrite(cover_image_url, editorId) ||
    translations.some((t) => !isAllowedUrlWrite(t.file_url, editorId))
  ) {
    return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
  }

  try {
    const chapter = await prisma.chapter.create({
      data: {
        manga_id,
        arc_id: arc_id || null,
        chapter_number: number,
        chapter_is_ex: isEx,
        chapter_name,
        published_date: publishedDate,
        cover_image_url: cover_image_url || null,
      },
    });

    // A new chapter IS the manga's update — bump its updated_at so it
    // moves to the front of "Latest Manga" / search and its card's
    // "updated X ago" badge turns fresh (nothing did this before, so those
    // only moved when the title/synopsis/images were edited).
    await prisma.manga.update({ where: { id: manga_id }, data: { updated_at: new Date() } });

    // Translation is keyed on chapter+language, so a chapter can carry a
    // PDF per language — one row created per language the admin uploaded.
    if (translations.length > 0) {
      await prisma.translation.createMany({
        data: translations.map((t) => ({
          chapter_id: chapter.id,
          language: t.language,
          file_url: t.file_url,
          file_name: t.file_name,
          translator_id: session?.user?.id ?? null,
        })),
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
