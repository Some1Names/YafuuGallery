import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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