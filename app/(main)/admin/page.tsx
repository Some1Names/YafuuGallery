import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getObjectSizes, keyFromPublicUrl } from "@/lib/storage";
import MangaBackground from "@/component/titles/MangaBackground";
import AdminDashboard from "@/component/admin/AdminDashboard";
import StorageUsageBar from "@/component/admin/StorageUsageBar";
import UnattributedStorage from "@/component/admin/UnattributedStorage";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const [
    userCount,
    mangaCount,
    chapterCount,
    objectSizes,
    users,
    mangaList,
    chapters,
    arcs,
    comments,
  ] = await Promise.all([
      prisma.user.count(),
      prisma.manga.count(),
      prisma.chapter.count(),
      getObjectSizes(),
      prisma.user.findMany({
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, tag: true, email: true, role: true, created_at: true, image: true },
      }),
      prisma.manga.findMany({
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          manga_title: true,
          manga_synopsis: true,
          cover_image_url: true,
          banner_image_url: true,
          is_featured: true,
          author: { select: { name: true, email: true } },
          _count: { select: { chapters: true, bookmarks: true } },
        },
      }),
      prisma.chapter.findMany({
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
        select: {
          id: true,
          body: true,
          hidden_at: true,
          created_at: true,
          user: { select: { id: true, name: true, tag: true } },
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

  // R2 objects aren't tagged with the manga/chapter they belong to — the
  // only record of that is whichever *_url column stored the object's own
  // public URL, so attribution works backwards from those columns rather
  // than from anything in R2 itself.
  function sizeOfUrl(url: string | null): number {
    const key = keyFromPublicUrl(url);
    return key ? objectSizes.get(key) ?? 0 : 0;
  }

  const chapterBytes = new Map<string, number>();
  for (const c of chapters) {
    const bytes =
      sizeOfUrl(c.cover_image_url) + c.translations.reduce((sum, t) => sum + sizeOfUrl(t.file_url), 0);
    chapterBytes.set(c.id, bytes);
  }

  // Every *_url column in the schema that can point at an R2 object —
  // whatever key isn't referenced by any of these is a leftover no manga,
  // chapter, arc, or user is still holding onto (an old avatar after a
  // re-upload, or a cover picked mid-edit and then abandoned by Cancel).
  const referencedKeys = new Set<string>();
  for (const m of mangaList) {
    for (const url of [m.cover_image_url, m.banner_image_url]) {
      const key = keyFromPublicUrl(url);
      if (key) referencedKeys.add(key);
    }
  }
  for (const a of arcs) {
    const key = keyFromPublicUrl(a.arc_image_url);
    if (key) referencedKeys.add(key);
  }
  for (const c of chapters) {
    const key = keyFromPublicUrl(c.cover_image_url);
    if (key) referencedKeys.add(key);
    for (const t of c.translations) {
      const tKey = keyFromPublicUrl(t.file_url);
      if (tKey) referencedKeys.add(tKey);
    }
  }
  for (const u of users) {
    const key = keyFromPublicUrl(u.image);
    if (key) referencedKeys.add(key);
  }

  const orphanedObjects = [...objectSizes.entries()]
    .filter(([key]) => !referencedKeys.has(key))
    .map(([key, size]) => ({ key, size }))
    .sort((a, b) => b.size - a.size);

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
    // Own cover/banner + every arc image + every chapter's cover and PDFs.
    storageBytes:
      sizeOfUrl(m.cover_image_url) +
      sizeOfUrl(m.banner_image_url) +
      arcs
        .filter((a) => a.manga_id === m.id)
        .reduce((sum, a) => sum + sizeOfUrl(a.arc_image_url), 0) +
      chapters
        .filter((c) => c.manga_id === m.id)
        .reduce((sum, c) => sum + (chapterBytes.get(c.id) ?? 0), 0),
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
    storageBytes: chapterBytes.get(c.id) ?? 0,
  }));

  const commentItems = comments.map((c) => ({
    id: c.id,
    userId: c.user.id,
    body: c.body,
    userName: c.user.name ?? "Unknown",
    userTag: c.user.tag,
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

        <StorageUsageBar
          bytesUsed={[...objectSizes.values()].reduce((sum, size) => sum + size, 0)}
          objectCount={objectSizes.size}
        />

        <UnattributedStorage objects={orphanedObjects} />

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
