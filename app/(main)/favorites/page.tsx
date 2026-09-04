import Link from "next/link";
import { redirect } from "next/navigation";
import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import FavoriteChapterCard from "@/component/titles/FavoriteChapterCard";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

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
            chapters: {
              orderBy: { chapter_number: "desc" },
              take: 1,
              select: { chapter_number: true, chapter_name: true },
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

  const tabClass = (isActive: boolean) =>
    "px-4 py-1.5 rounded text-sm font-mono transition-colors duration-200 " +
    (isActive ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]");

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} relative min-h-screen bg-[#0a0a0a] px-6 sm:px-8 py-12 font-(family-name:--font-body)`}
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-2">
            Favorites
          </h1>
          <p className="text-sm text-[#b6b0a2]">
            Manga and chapters you&apos;ve bookmarked, all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1 p-1 mb-10 rounded-md border border-[#050505] bg-[#1b1a1c]">
          <Link href="?tab=manga" className={tabClass(activeTab === "manga")}>
            Manga
            <span className="ml-1.5 text-xs text-[#6b655e]">{bookmarkedManga.length}</span>
          </Link>
          <Link href="?tab=chapters" className={tabClass(activeTab === "chapters")}>
            Chapters
            <span className="ml-1.5 text-xs text-[#6b655e]">{favoritedChapters.length}</span>
          </Link>
        </div>

        {activeTab === "manga" ? (
          bookmarkedManga.length === 0 ? (
            <div className="border border-[#050505] rounded-md bg-[#1b1a1c]/60 py-16 px-6 text-center">
              <p className="text-[#b6b0a2] font-mono text-sm">
                No manga bookmarked yet — hit &quot;Add to Favorites&quot; on a manga page to see it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {bookmarkedManga.map(({ manga }) => {
                const latest = manga.chapters[0];
                return (
                  <MangaCard
                    key={manga.id}
                    id={manga.id}
                    title={manga.manga_title}
                    author={manga.author.name ?? "Unknown"}
                    coverImageUrl={manga.cover_image_url}
                    latestChapterNumber={latest?.chapter_number ?? null}
                    latestChapterName={latest?.chapter_name ?? null}
                    updatedAt={manga.updated_at}
                    isFavorited
                  />
                );
              })}
            </div>
          )
        ) : favoritedChapters.length === 0 ? (
          <div className="border border-[#050505] rounded-md bg-[#1b1a1c]/60 py-16 px-6 text-center">
            <p className="text-[#b6b0a2] font-mono text-sm">
              No favorited chapters yet — tap the heart on any chapter to see it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {chapterGroups.map((group) => (
              <div key={group.mangaId}>
                <Link
                  href={`/manga/titles/${group.mangaId}`}
                  className="inline-block text-xl text-[#ece6d8] hover:text-white font-(family-name:--font-display) mb-4 transition-colors duration-200"
                >
                  {group.mangaTitle}
                </Link>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {group.chapters.map(({ chapter }) => (
                    <FavoriteChapterCard
                      key={chapter.id}
                      chapterId={chapter.id}
                      chapterNumber={chapter.chapter_number}
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
