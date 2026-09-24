import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import FavoriteChapterCard from "@/component/titles/FavoriteChapterCard";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import { loginHref } from "@/lib/login-redirect";

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: "manga" | "chapters" = tab === "chapters" ? "chapters" : "manga";

  const session = await auth();
  if (!session?.user?.id) {
    // come straight back here (same tab) once signed in
    redirect(loginHref(activeTab === "chapters" ? "/favorites?tab=chapters" : "/favorites"));
  }
  const userId = session.user.id;

  const [bookmarkedManga, favoritedChapters] = await Promise.all([
    prisma.bookmark.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        manga: {
          include: {
            author: { select: { name: true } },
            // chapter_number is a 0-indexed sort key, not the number shown
            // to readers, and doesn't skip "ex" entries — computing the
            // real display number needs every chapter (see
            // lib/chapter-number.ts)
            chapters: {
              select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true },
            },
          },
        },
      },
    }),
    prisma.chapterBookmark.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        chapter: {
          select: {
            id: true,
            chapter_number: true,
            chapter_is_ex: true,
            chapter_name: true,
            cover_image_url: true,
            manga: { select: { id: true, manga_title: true } },
          },
        },
      },
    }),
  ]);

  // Chapter favorites can span any number of series — group them by manga
  // so the grid reads as "here's what you've saved from each title" rather
  // than one flat, unlabeled mix.
  const chapterGroups: { mangaId: string; mangaTitle: string; chapters: typeof favoritedChapters }[] = [];
  for (const fav of favoritedChapters) {
    const { id: mangaId, manga_title: mangaTitle } = fav.chapter.manga;
    let group = chapterGroups.find((g) => g.mangaId === mangaId);
    if (!group) {
      group = { mangaId, mangaTitle, chapters: [] };
      chapterGroups.push(group);
    }
    group.chapters.push(fav);
  }

  // chapter_number is a 0-indexed sort key, not the number shown to
  // readers — the display number depends on this chapter's position among
  // its OWN manga's non-ex chapters, so fetch each group's manga's full
  // chapter list to compute it correctly (see lib/chapter-number.ts).
  const favMangaIds = chapterGroups.map((g) => g.mangaId);
  const favSiblingChapters = favMangaIds.length
    ? await prisma.chapter.findMany({
        where: { manga_id: { in: favMangaIds } },
        select: { id: true, manga_id: true, chapter_number: true, chapter_is_ex: true },
      })
    : [];
  const favDisplayNumbers = new Map(
    favMangaIds.map((mangaId) => [
      mangaId,
      getChapterDisplayNumbers(favSiblingChapters.filter((c) => c.manga_id === mangaId)),
    ])
  );

  // Same tab treatment as the manga page's Chapters/Arcs and the navbar:
  // display face, count beside the label, current tab marked by a 2px ink
  // bar sitting on the row's bottom rule.
  const tabs = [
    { id: "manga" as const, label: "Manga", count: bookmarkedManga.length },
    { id: "chapters" as const, label: "Chapters", count: favoritedChapters.length },
  ];

  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">
            Favorites
          </h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">
            Manga and chapters you&apos;ve bookmarked, all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-10 border-b border-fg/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?tab=${tab.id}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  "relative pb-3 text-lg sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
                  (isActive ? "text-fg" : "text-fg-muted hover:text-fg-secondary")
                }
              >
                {tab.label}
                <span className="ml-2 align-middle text-xs font-(family-name:--font-body) font-medium">{tab.count}</span>
                {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />}
              </Link>
            );
          })}
        </div>

        {activeTab === "manga" ? (
          bookmarkedManga.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">
                No favorite manga yet. Tap &quot;Favorite&quot; on any manga page to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {bookmarkedManga.map(({ manga }) => {
                const latest = manga.chapters.slice().sort((a, b) => b.chapter_number - a.chapter_number)[0];
                const displayNumbers = getChapterDisplayNumbers(manga.chapters);
                return (
                  <MangaCard
                    key={manga.id}
                    id={manga.id}
                    title={manga.manga_title}
                    author={manga.author.name ?? "Unknown"}
                    coverImageUrl={manga.cover_image_url}
                    latestChapterDisplayNumber={latest ? (displayNumbers.get(latest.id) ?? null) : null}
                    latestChapterIsEx={latest?.chapter_is_ex ?? false}
                    latestChapterName={latest?.chapter_name ?? null}
                    updatedAt={manga.updated_at}
                    isFavorited
                  />
                );
              })}
            </div>
          )
        ) : favoritedChapters.length === 0 ? (
          <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
            <p className="text-fg-secondary text-sm">
              No favorite chapters yet. Tap the heart on any chapter to save it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {chapterGroups.map((group) => (
              <div key={group.mangaId}>
                <Link
                  href={`/manga/titles/${group.mangaId}`}
                  className="inline-block text-xl text-fg hover:text-fg-hover font-(family-name:--font-display) mb-4 transition-colors duration-200"
                >
                  {group.mangaTitle}
                </Link>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {group.chapters.map(({ chapter }) => (
                    <FavoriteChapterCard
                      key={chapter.id}
                      chapterId={chapter.id}
                      displayNumber={favDisplayNumbers.get(group.mangaId)?.get(chapter.id) ?? 0}
                      chapterIsEx={chapter.chapter_is_ex}
                      chapterName={chapter.chapter_name}
                      coverImageUrl={chapter.cover_image_url}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
