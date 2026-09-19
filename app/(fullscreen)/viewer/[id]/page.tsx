import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ChapterReaderClient from "@/component/titles/ChapterReaderClient";
import { getChapterDisplayNumbers, formatChapterBadge } from "@/lib/chapter-number";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    select: {
      chapter_is_ex: true,
      chapter_name: true,
      cover_image_url: true,
      manga: {
        select: {
          manga_title: true,
          chapters: { select: { id: true, chapter_number: true, chapter_is_ex: true } },
        },
      },
    },
  });

  if (!chapter) return {};

  const displayNumber = getChapterDisplayNumbers(chapter.manga.chapters).get(id);
  const badge = formatChapterBadge(chapter.chapter_is_ex, displayNumber);
  const title = `${badge} ${chapter.chapter_name}`;
  const description = `Read ${badge} — ${chapter.chapter_name} of ${chapter.manga.manga_title} on YafuuGallery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "YafuuGallery",
      type: "article",
      ...(chapter.cover_image_url && { images: [chapter.cover_image_url] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(chapter.cover_image_url && { images: [chapter.cover_image_url] }),
    },
  };
}

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
        comment_count: true,
        translations: { select: { file_url: true, language: true } },
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
      translations={chapter.translations.map((t) => ({ language: t.language, url: t.file_url }))}
      currentChapterId={id}
      chapterName={chapter.chapter_name}
      mangaTitle={chapter.manga.manga_title}
      mangaId={chapter.manga.id}
      chapters={chapter.manga.chapters}
      currentUserId={session?.user?.id ?? null}
      initialCommentCount={chapter.comment_count}
    />
  );
}