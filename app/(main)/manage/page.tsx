import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaBackground from "@/component/titles/MangaBackground";
import ManageMangaDashboard from "@/component/manage/ManageMangaDashboard";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ManagePage");
  return { title: t("title") };
}

export default async function ManageMangaPage() {
  const session = await auth();
  const t = await getTranslations("ManagePage");

  if (session?.user?.role !== "author" && session?.user?.role !== "admin") {
    redirect("/");
  }

  const authorId = session.user.id;

  const [mangaList, chapters, arcs, commentCount, reportedCount] = await Promise.all([
    prisma.manga.findMany({
      where: { author_id: authorId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        manga_title: true,
        manga_synopsis: true,
        cover_image_url: true,
        banner_image_url: true,
        genres: true,
        manga_status: true,
        _count: { select: { chapters: true, bookmarks: true } },
      },
    }),
    prisma.chapter.findMany({
      where: { manga: { author_id: authorId } },
      orderBy: [{ manga: { manga_title: "asc" } }, { chapter_number: "asc" }],
      select: {
        id: true,
        manga_id: true,
        arc_id: true,
        chapter_number: true,
        chapter_is_ex: true,
        chapter_name: true,
        published_date: true,
        cover_image_url: true,
        view_count: true,
        arc: { select: { arc_name: true } },
        translations: { select: { file_url: true, file_name: true, language: true } },
        _count: { select: { chapter_bookmarks: true, comments: true } },
      },
    }),
    prisma.arc.findMany({
      where: { manga: { author_id: authorId } },
      orderBy: { arc_order: "asc" },
      select: {
        id: true,
        arc_name: true,
        arc_order: true,
        arc_is_ex: true,
        arc_status: true,
        arc_image_url: true,
        manga_id: true,
      },
    }),
    // Comments on this author's manga load a page at a time in their tab
    // (lib/admin-lists.ts) — only the counts are needed here.
    prisma.comment.count({ where: { chapter: { manga: { author_id: authorId } } } }),
    prisma.comment.count({ where: { chapter: { manga: { author_id: authorId } }, reports: { some: {} } } }),
  ]);

  const mangaItems = mangaList.map((m) => ({
    id: m.id,
    title: m.manga_title,
    synopsis: m.manga_synopsis,
    chapterCount: m._count.chapters,
    viewCount: chapters
      .filter((c) => c.manga_id === m.id)
      .reduce((sum, c) => sum + c.view_count, 0),
    favoriteCount: m._count.bookmarks,
    coverImageUrl: m.cover_image_url,
    bannerImageUrl: m.banner_image_url,
    genres: m.genres,
    status: m.manga_status,
  }));

  const chapterItems = chapters.map((c) => ({
    id: c.id,
    mangaId: c.manga_id,
    arcId: c.arc_id,
    arcName: c.arc?.arc_name ?? null,
    chapterNumber: c.chapter_number,
    chapterIsEx: c.chapter_is_ex,
    chapterName: c.chapter_name,
    publishedDate: c.published_date,
    coverImageUrl: c.cover_image_url,
    translations: c.translations.map((t) => ({
      language: t.language,
      url: t.file_url,
      fileName: t.file_name,
    })),
    favoriteCount: c._count.chapter_bookmarks,
    commentCount: c._count.comments,
  }));

  return (
    <div className="relative min-h-screen bg-bg px-4 sm:px-6 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">{t("heading")}</h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">{t("subtitle")}</p>
        </div>

        <ManageMangaDashboard
          mangaList={mangaItems}
          chapters={chapterItems}
          arcs={arcs}
          commentCount={commentCount}
          reportedCount={reportedCount}
          authorName={session.user.name ?? session.user.email ?? t("you")}
        />
      </div>
    </div>
  );
}
