import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/component/profile/ProfileEditForm";
import ContinueReadingCard from "@/component/titles/ContinueReadingCard";
import MangaBackground from "@/component/titles/MangaBackground";
import { getContinueReading } from "@/lib/continue-reading";
import { loginHref } from "@/lib/login-redirect";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(loginHref("/profile"));
  }

  const userId = session.user.id;

  const [user, bookmarkCount, chapterFavoriteCount, commentCount, chaptersReadCount, recentProgress] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, tag: true, email: true, image: true, role: true, created_at: true },
      }),
      prisma.bookmark.count({ where: { user_id: userId } }),
      prisma.chapterBookmark.count({ where: { user_id: userId } }),
      prisma.comment.count({ where: { user_id: userId } }),
      prisma.readingProgress.count({ where: { user_id: userId } }),
      getContinueReading(userId, 4),
    ]);

  if (!user) redirect(loginHref("/profile"));

  const stats = [
    { label: "Manga favorited", value: bookmarkCount, href: "/favorites?tab=manga" },
    { label: "Chapters favorited", value: chapterFavoriteCount, href: "/favorites?tab=chapters" },
    { label: "Chapters read", value: chaptersReadCount },
    { label: "Comments", value: commentCount },
  ];

  return (
    <div
      className="relative min-h-screen bg-bg px-4 sm:px-6 py-12"
    >
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">Profile</h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">Manage your account and see your activity.</p>
        </div>

        {/* Identity + edit form — no padding here so the avatar can bleed
            flush against the card's edges; ProfileEditForm pads its own
            text column instead */}
        <div className="border border-border rounded-md overflow-hidden bg-surface/60 mb-10">
          <ProfileEditForm
            initialName={user.name ?? ""}
            initialImage={user.image}
            tag={user.tag}
            email={user.email}
            role={user.role}
            createdAt={user.created_at}
            stats={stats}
          />
        </div>

        {/* Stats now render inside ProfileEditForm's card, styled to match */}

        {/* Recently read — up to 4 chapters, any title. 2x2 on phone,
            one row of 4 from sm up, so the last item never wraps alone. */}
        <section>
          <h2 className="text-xl text-fg font-(family-name:--font-display) mb-4">
            Continue reading
          </h2>
          {recentProgress.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">
                No reading history yet — open a chapter to start tracking progress.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-7xl">
              {recentProgress.map((p) => (
                <ContinueReadingCard
                  key={p.id}
                  chapterId={p.chapterId}
                  displayNumber={p.displayNumber}
                  chapterIsEx={p.chapterIsEx}
                  chapterName={p.chapterName}
                  coverImageUrl={p.coverImageUrl}
                  mangaTitle={p.mangaTitle}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
