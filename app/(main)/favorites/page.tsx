import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import FavoriteChapterRow from "@/component/titles/FavoriteChapterRow";

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
            manga: { select: { id: true, manga_title: true } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-8 py-12">
      <div className="max-w-350 mx-auto">
        <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-6">
          Favorites
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-[#050505] pb-3">
          <Link
            href="?tab=manga"
            className={
              "text-sm font-mono transition-colors duration-200 " +
              (activeTab === "manga" ? "text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Manga ({bookmarkedManga.length})
          </Link>
          <Link
            href="?tab=chapters"
            className={
              "text-sm font-mono transition-colors duration-200 " +
              (activeTab === "chapters" ? "text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]")
            }
          >
            Chapters ({favoritedChapters.length})
          </Link>
        </div>

        {activeTab === "manga" ? (
          bookmarkedManga.length === 0 ? (
            <p className="text-[#b6b0a2] font-mono text-sm">
              No manga bookmarked yet — hit &quot;Add to Favorites&quot; on a manga page to see it here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
                  />
                );
              })}
            </div>
          )
        ) : favoritedChapters.length === 0 ? (
          <p className="text-[#b6b0a2] font-mono text-sm">
            No favorited chapters yet — tap the heart on any chapter to see it here.
          </p>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {favoritedChapters.map(({ chapter }) => (
              <FavoriteChapterRow
                key={chapter.id}
                chapterId={chapter.id}
                chapterNumber={chapter.chapter_number}
                chapterName={chapter.chapter_name}
                mangaId={chapter.manga.id}
                mangaTitle={chapter.manga.manga_title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}