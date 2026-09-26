import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { keyFromPublicUrl, listObjects } from "@/lib/storage";
import { findOrphanedObjects, getReferencedStorageKeys } from "@/lib/storage-references";
import MangaBackground from "@/component/titles/MangaBackground";
import AdminDashboard from "@/component/admin/AdminDashboard";
import StorageUsageBar from "@/component/admin/StorageUsageBar";
import UnattributedStorage from "@/component/admin/UnattributedStorage";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminPage");
  return { title: t("title") };
}

export default async function AdminPage() {
  const session = await auth();
  const t = await getTranslations("AdminPage");

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const [
    userCount,
    mangaCount,
    chapterCount,
    storedObjects,
    referencedKeys,
    mangaList,
    chapters,
    arcs,
    commentCount,
    reportedCount,
  ] = await Promise.all([
      prisma.user.count(),
      prisma.manga.count(),
      prisma.chapter.count(),
      listObjects(),
      getReferencedStorageKeys(),
      prisma.manga.findMany({
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          manga_title: true,
          manga_synopsis: true,
          cover_image_url: true,
          banner_image_url: true,
          genres: true,
          manga_status: true,
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
      // Users and Comments load a page at a time in their own tabs
      // (lib/admin-lists.ts) — only the tab counts are needed here.
      prisma.comment.count(),
      prisma.comment.count({ where: { reports: { some: {} } } }),
    ]);

  const objectSizes = new Map(storedObjects.map((o) => [o.key, o.size]));

  const stats = [
    { label: t("stats.users"), value: userCount },
    { label: t("stats.manga"), value: mangaCount },
    { label: t("stats.chapters"), value: chapterCount },
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

  // Leftovers no manga, chapter, arc, or user still points at (an old
  // avatar after a re-upload, a cover picked mid-edit then abandoned by
  // Cancel). Same shared definition the delete route re-checks against at
  // delete time (lib/storage-references.ts) — including skipping anything
  // uploaded too recently to be safely called orphaned.
  const orphanedObjects = findOrphanedObjects(storedObjects, referencedKeys)
    .map(({ key, size }) => ({ key, size }))
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
    genres: m.genres,
    status: m.manga_status,
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

  return (
    <div
      className="relative min-h-screen bg-bg px-4 sm:px-6 py-12"
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">{t("title")}</h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">{t("subtitle")}</p>
        </div>

        {/* Stats — always visible above the tabs, regardless of which
            section is open */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="border border-border rounded-md p-4 bg-surface/60">
              <div className="text-2xl text-fg font-(family-name:--font-display)">{s.value}</div>
              <div className="text-xs text-fg-secondary mt-1">{s.label}</div>
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
          userCount={userCount}
          commentCount={commentCount}
          reportedCount={reportedCount}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
