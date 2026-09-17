import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaBackground from "@/component/titles/MangaBackground";
import ManageMangaDashboard from "@/component/manage/ManageMangaDashboard";

export default async function ManageMangaPage() {
  const session = await auth();

  if (session?.user?.role !== "author" && session?.user?.role !== "admin") {
    redirect("/");
  }

  const authorId = session.user.id;

  const [mangaList, chapters, arcs] = await Promise.all([
    prisma.manga.findMany({
      where: { author_id: authorId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        manga_title: true,
        manga_synopsis: true,
        cover_image_url: true,
        banner_image_url: true,
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
    pdfUrl: c.translations[0]?.file_url ?? null,
    pdfFileName: c.translations[0]?.file_name ?? null,
    pdfLanguage: c.translations[0]?.language ?? "en",
  }));

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] px-4 sm:px-6 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-2">Manage Manga</h1>
          <p className="text-sm text-[#b6b0a2]">Create and manage your own manga, arcs, and chapters.</p>
        </div>

        <ManageMangaDashboard
          mangaList={mangaItems}
          chapters={chapterItems}
          arcs={arcs}
          authorName={session.user.name ?? session.user.email ?? "You"}
        />
      </div>
    </div>
  );
}
