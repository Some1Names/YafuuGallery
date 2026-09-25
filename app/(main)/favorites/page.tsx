import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import FavoriteChapterCard from "@/component/titles/FavoriteChapterCard";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import { loginHref } from "@/lib/login-redirect";
import { getFavoriteUpdates, getNewChapterCounts } from "@/lib/favorite-updates";
import { parsePageCount, splitExtraRow } from "@/lib/pagination";
import FavoriteUpdateRow from "@/component/titles/FavoriteUpdateRow";
import MarkUpdatesReadButton from "@/component/titles/MarkUpdatesReadButton";
import ShowMoreLink from "@/component/ShowMoreLink";

type Tab = "manga" | "chapters" | "updates";

const UPDATES_PAGE_SIZE = 20;

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string | string[] }>;
}) {
  const { tab, page } = await searchParams;
  const activeTab: Tab = tab === "chapters" || tab === "updates" ? tab : "manga";
  const updatesLimit = parsePageCount(page) * UPDATES_PAGE_SIZE;

  const session = await auth();
  if (!session?.user?.id) {
    // come straight back here (same tab) once signed in
    redirect(loginHref(activeTab === "manga" ? "/favorites" : `/favorites?tab=${activeTab}`));
  }
  const userId = session.user.id;

  const [bookmarkedManga, favoritedChapters, newCounts, updateRows] = await Promise.all([
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
    getNewChapterCounts(userId),
    // the feed is only fetched when it's the tab being shown
    activeTab === "updates" ? getFavoriteUpdates(userId, updatesLimit) : Promise.resolve([]),
  ]);
  const { items: updates, hasMore: hasMoreUpdates } = splitExtraRow(updateRows, updatesLimit);
  const newTotal = [...newCounts.values()].reduce((sum, n) => sum + n, 0);

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
  // Updates counts NEW chapters (in red when there are any), not every
  // chapter in the feed — it's the tab's "you have something to read".
  const tabs: { id: Tab; label: string; count: number; alert?: boolean }[] = [
    { id: "manga", label: "Manga", count: bookmarkedManga.length },
    { id: "chapters", label: "Chapters", count: favoritedChapters.length },
    { id: "updates", label: "Updates", count: newTotal, alert: newTotal > 0 },
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
        {/* Tab row: slightly smaller on phones so it fits a 375px screen, and
            sideways-scrollable as a fallback on anything narrower (the border
            and active bar live on the inner row, so the scroller can't clip them). */}
        <div className="mb-10 overflow-x-auto [scrollbar-width:none]">
        <div className="flex gap-3 min-[360px]:gap-4 sm:gap-6 border-b border-fg/10 w-max min-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?tab=${tab.id}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  "relative pb-3 whitespace-nowrap text-[15px] min-[360px]:text-base sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
                  (isActive ? "text-fg" : "text-fg-muted hover:text-fg-secondary")
                }
              >
                {tab.label}
                <span
                  className={
                    "ml-1.5 sm:ml-2 align-middle text-xs font-(family-name:--font-body) font-medium " +
                    (tab.alert ? "text-red-500 [.light_&]:text-red-700" : "")
                  }
                >
                  {tab.count}
                  {tab.alert && <span className="sr-only"> new</span>}
                </span>
                {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />}
              </Link>
            );
          })}
        </div>
        </div>

        {activeTab === "updates" ? (
          bookmarkedManga.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">
                Favorite a manga and its new chapters will show up here.
              </p>
            </div>
          ) : updates.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">Your favorite manga don&apos;t have any chapters yet.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 mb-4 min-h-6">
                {/* Phones get the short form — side by side with "Mark all
                    as read", the full sentence and the button both wrapped
                    onto two lines. */}
                <p className="min-w-0 text-sm text-fg-secondary">
                  {newTotal > 0 ? (
                    <>
                      {newTotal} new {newTotal === 1 ? "chapter" : "chapters"}
                      <span className="hidden sm:inline"> since you last caught up</span>
                    </>
                  ) : (
                    "You're all caught up."
                  )}
                </p>
                {newTotal > 0 && <MarkUpdatesReadButton />}
              </div>
              <div className="flex flex-col gap-2">
                {updates.map((item) => (
                  <FavoriteUpdateRow key={item.chapterId} item={item} />
                ))}
              </div>
              {hasMoreUpdates && (
                <ShowMoreLink href={`/favorites?tab=updates&page=${parsePageCount(page) + 1}`} />
              )}
            </>
          )
        ) : activeTab === "manga" ? (
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
                    newChapterCount={newCounts.get(manga.id)}
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
