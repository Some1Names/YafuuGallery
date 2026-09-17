import { notFound } from "next/navigation";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ChapterReaderClient from "@/component/titles/ChapterReaderClient";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Independent of each other — one round trip instead of two.
  const [chapter, session] = await Promise.all([
    prisma.chapter.findUnique({
      where: { id },
      select: {
        chapter_number: true,
        chapter_name: true,
        translations: { select: { file_url: true } },
        manga: {
          select: {
            id: true,
            manga_title: true,
            chapters: {
              orderBy: { chapter_number: "asc" },
              select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
            },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!chapter) {
    notFound();
  }

  // Record/bump reading progress so "Continue reading" on the profile page
  // has something to show — one row per (user, chapter), updated_at refreshed
  // on every visit via Prisma's @updatedAt. Deferred via after() instead of
  // awaited: this is the single most-visited route in the app, and nothing
  // on this page depends on the write succeeding before rendering — after()
  // still guarantees it runs to completion (unlike a bare un-awaited
  // promise, which a serverless platform can kill once the response ships).
  if (session?.user?.id) {
    const userId = session.user.id;
    after(() =>
      prisma.readingProgress.upsert({
        where: { user_id_chapter_id: { user_id: userId, chapter_id: id } },
        create: { user_id: userId, chapter_id: id },
        update: {},
      })
    );
  }

  return (
    <ChapterReaderClient
      pdfUrl={chapter.translations[0]?.file_url ?? null}
      currentChapterId={id}
      chapterName={chapter.chapter_name}
      mangaTitle={chapter.manga.manga_title}
      mangaId={chapter.manga.id}
      chapters={chapter.manga.chapters}
    />
  );
}