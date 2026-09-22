import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import FavoriteChapterCard from "@/component/titles/FavoriteChapterCard";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { tab } = await searchParams;
  const activeTab: "manga" | "chapters" = tab === "chapters" ? "chapters" : "manga";
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

  const tabClass = (isActive: boolean) =>
    "px-4 py-1.5 rounded text-sm transition-colors duration-200 " +
    (isActive ? "bg-surface-hover text-fg" : "text-fg-secondary hover:text-fg");

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
        <div className="inline-flex items-center gap-1 p-1 mb-10 rounded-md border border-border bg-surface">
          <Link href="?tab=manga" className={tabClass(activeTab === "manga")}>
            Manga
            <span className="ml-1.5 text-xs text-fg-muted">{bookmarkedManga.length}</span>
          </Link>
          <Link href="?tab=chapters" className={tabClass(activeTab === "chapters")}>
            Chapters
            <span className="ml-1.5 text-xs text-fg-muted">{favoritedChapters.length}</span>
          </Link>
        </div>

        {activeTab === "manga" ? (
          bookmarkedManga.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">
                No manga bookmarked yet — hit &quot;Add to Favorites&quot; on a manga page to see it here.
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
              No favorited chapters yet — tap the heart on any chapter to see it here.
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
