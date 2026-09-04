import { redirect } from "next/navigation";
import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/component/profile/ProfileEditForm";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, bookmarkCount, chapterFavoriteCount, commentCount, recentProgressRaw] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, role: true, created_at: true },
      }),
      prisma.bookmark.count({ where: { user_id: userId } }),
      prisma.chapterBookmark.count({ where: { user_id: userId } }),
      prisma.comment.count({ where: { user_id: userId } }),
      prisma.readingProgress.findMany({
        where: { user_id: userId },
        orderBy: { updated_at: "desc" },
        take: 5,
        include: {
          chapter: {
            select: {
              chapter_number: true,
              chapter_name: true,
              manga: {
                select: {
                  id: true,
                  manga_title: true,
                  cover_image_url: true,
                  author: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
    ]);

  if (!user) redirect("/login");

  const recentProgress = recentProgressRaw.map((p) => ({
    id: p.id,
    updated_at: p.updated_at,
    chapter: { number: p.chapter.chapter_number, name: p.chapter.chapter_name },
    manga: {
      id: p.chapter.manga.id,
      title: p.chapter.manga.manga_title,
      author: p.chapter.manga.author.name ?? "Unknown",
      cover: p.chapter.manga.cover_image_url,
    },
  }));

  const stats = [
    { label: "Manga favorited", value: bookmarkCount },
    { label: "Chapters favorited", value: chapterFavoriteCount },
    { label: "Comments", value: commentCount },
  ];

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} relative min-h-screen bg-[#0a0a0a] px-4 sm:px-6 py-12 font-(family-name:--font-body)`}
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-225 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-2">Profile</h1>
          <p className="text-sm text-[#b6b0a2]">Manage your account and see your activity.</p>
        </div>

        {/* Identity + edit form — no padding here so the avatar can bleed
            flush against the card's edges; ProfileEditForm pads its own
            text column instead */}
        <div className="border border-[#050505] rounded-md overflow-hidden bg-[#1b1a1c]/60 mb-10">
          <ProfileEditForm
            initialName={user.name ?? ""}
            initialImage={user.image}
            email={user.email}
            role={user.role}
            createdAt={user.created_at}
            stats={stats}
          />
        </div>

        {/* Stats now render inside ProfileEditForm's card, styled to match */}

        {/* Recently read — 2 columns on phone (only the 2 most recent
            actually show, rest are hidden below the md breakpoint rather
            than just wrapping to more rows), 5 across on desktop */}
        <section>
          <h2 className="text-xl text-[#ece6d8] font-(family-name:--font-display) mb-4">
            Continue reading
          </h2>
          {recentProgress.length === 0 ? (
            <div className="border border-[#050505] rounded-md bg-[#1b1a1c]/60 py-16 px-6 text-center">
              <p className="text-[#b6b0a2] font-mono text-sm">
                No reading history yet — open a chapter to start tracking progress.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {recentProgress.map((p, i) => (
                <div key={p.id} className={i >= 2 ? "hidden md:block" : ""}>
                  <MangaCard
                    id={p.manga.id}
                    title={p.manga.title}
                    author={p.manga.author}
                    coverImageUrl={p.manga.cover}
                    latestChapterNumber={p.chapter.number}
                    latestChapterName={p.chapter.name}
                    updatedAt={p.updated_at}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
