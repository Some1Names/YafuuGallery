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
    translations: translationsInput,
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
  const translations = parseTranslations(translationsInput);
  const submittedLanguages = translations.map((t) => t.language);

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

    // The submitted array is the chapter's full desired translation list —
    // any language the chapter currently has that isn't in it anymore was
    // removed in the edit form and gets deleted, while every submitted
    // language is upserted (new file, or a replacement for an existing one).
    await prisma.$transaction([
      prisma.translation.deleteMany({
        where: { chapter_id: id, language: { notIn: submittedLanguages } },
      }),
      ...translations.map((t) =>
        prisma.translation.upsert({
          where: { chapter_id_language: { chapter_id: id, language: t.language } },
          create: {
            chapter_id: id,
            language: t.language,
            file_url: t.file_url,
            file_name: t.file_name,
            translator_id: session?.user?.id ?? null,
          },
          update: {
            file_url: t.file_url,
            file_name: t.file_name,
            translator_id: session?.user?.id ?? null,
          },
        })
      ),
    ]);

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
