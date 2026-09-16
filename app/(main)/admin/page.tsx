import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaBackground from "@/component/titles/MangaBackground";
import AdminDashboard from "@/component/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const [
    userCount,
    mangaCount,
    chapterCount,
    users,
    mangaList,
    chapters,
    arcs,
    comments,
  ] = await Promise.all([
      prisma.user.count(),
      prisma.manga.count(),
      prisma.chapter.count(),
      prisma.user.findMany({
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, email: true, role: true, created_at: true },
      }),
      prisma.manga.findMany({
        orderBy: { created_at: "desc" },
        include: {
          author: { select: { name: true, email: true } },
          _count: { select: { chapters: true, bookmarks: true } },
        },
      }),
      prisma.chapter.findMany({
        orderBy: [{ manga: { manga_title: "asc" } }, { chapter_number: "asc" }],
        include: {
          arc: { select: { arc_name: true } },
          translations: { select: { file_url: true, file_name: true } },
        },
      }),
      prisma.arc.findMany({
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
      prisma.comment.findMany({
        orderBy: { created_at: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          chapter: {
            select: {
              chapter_number: true,
              manga: { select: { manga_title: true } },
            },
          },
        },
      }),
    ]);

  const stats = [
    { label: "Users", value: userCount },
    { label: "Manga", value: mangaCount },
    { label: "Chapters", value: chapterCount },
  ];

  const mangaItems = mangaList.map((m) => ({
    id: m.id,
    title: m.manga_title,
    synopsis: m.manga_synopsis,
    authorName: m.author.name ?? m.author.email,
    chapterCount: m._count.chapters,
    viewCount: chapters
      .filter((c) => c.manga_id === m.id)
      .reduce((sum, c) => sum + c.view_count, 0),
    favoriteCount: m._count.bookmarks,
    coverImageUrl: m.cover_image_url,
    bannerImageUrl: m.banner_image_url,
    isFeatured: m.is_featured,
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
  }));

  const commentItems = comments.map((c) => ({
    id: c.id,
    userId: c.user.id,
    body: c.body,
    userName: c.user.name ?? "Unknown",
    chapterLabel: `${c.chapter.manga.manga_title} #${String(c.chapter.chapter_number).padStart(3, "0")}`,
    createdAt: c.created_at,
    hidden: c.hidden_at !== null,
  }));

  return (
    <div
      className="relative min-h-screen bg-[#0a0a0a] px-4 sm:px-6 py-12"
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-2">Admin</h1>
          <p className="text-sm text-[#b6b0a2]">Manage manga, chapters, users, and comment moderation.</p>
        </div>

        {/* Stats — always visible above the tabs, regardless of which
            section is open */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="border border-[#050505] rounded-md p-4 bg-[#1b1a1c]/60">
              <div className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">{s.value}</div>
              <div className="text-xs text-[#b6b0a2] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <AdminDashboard
          mangaList={mangaItems}
          chapters={chapterItems}
          arcs={arcs}
          users={users}
          comments={commentItems}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
