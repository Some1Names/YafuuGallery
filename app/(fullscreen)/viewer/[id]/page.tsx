import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ChapterReaderClient from "@/component/titles/ChapterReaderClient";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chapter = await prisma.chapter.findUnique({
    where: { id },
    select: {
      chapter_number: true,
      chapter_name: true,
      manga: {
        select: {
          id: true,
          manga_title: true,
          chapters: {
            orderBy: { chapter_number: "asc" },
            select: { id: true, chapter_number: true, chapter_name: true },
          },
        },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  // Record/bump reading progress so "Continue reading" on the profile page
  // has something to show — one row per (user, chapter), updated_at refreshed
  // on every visit via Prisma's @updatedAt.
  const session = await auth();
  if (session?.user?.id) {
    await prisma.readingProgress.upsert({
      where: { user_id_chapter_id: { user_id: session.user.id, chapter_id: id } },
      create: { user_id: session.user.id, chapter_id: id },
      update: {},
    });
  }

  return (
    <ChapterReaderClient
      // hardcoded on purpose — no Translation/file-storage wiring yet
      pdfUrl="/chapters/mangatest.pdf"
      chapterLabel={`Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`}
      chapterNumber={chapter.chapter_number}
      mangaTitle={chapter.manga.manga_title}
      mangaId={chapter.manga.id}
      chapters={chapter.manga.chapters}
    />
  );
}