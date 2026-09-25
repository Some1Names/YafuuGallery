import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/component/profile/ProfileEditForm";
import ContinueReadingCard from "@/component/titles/ContinueReadingCard";
import MangaBackground from "@/component/titles/MangaBackground";
import { getContinueReading } from "@/lib/continue-reading";
import { fullRowCount } from "@/lib/grid-rows";
import { loginHref } from "@/lib/login-redirect";

export const metadata: Metadata = { title: "Profile" };

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
      prisma.readingProgress.count({ where: { user_id: userId, completed: true } }),
      getContinueReading(userId, 4),
    ]);

  if (!user) redirect(loginHref("/profile"));

  // phones: 2 columns, so 3 cards would leave the third alone on its row
  const phoneShown = fullRowCount(recentProgress.length, 2);

  const stats = [
    { label: "Manga favorited", value: bookmarkCount, href: "/favorites?tab=manga" },
    { label: "Chapters favorited", value: chapterFavoriteCount, href: "/favorites?tab=chapters" },
    // read through to the last page (ReadingProgress.completed, set by
    // the reader) — not just opened
    { label: "Chapters finished", value: chaptersReadCount },
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
            one row of 4 from sm up; phones drop a card that would sit
            alone on the last row (the rest are in Reading history). */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2 className="text-xl text-fg font-(family-name:--font-display)">Continue reading</h2>
            {recentProgress.length > 0 && (
              <Link
                href="/history"
                className="shrink-0 py-2 -my-2 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
              >
                {/* short on phones so the heading beside it stays on one line */}
                <span className="sm:hidden">History</span>
                <span className="hidden sm:inline">Reading history</span> <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          {recentProgress.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
              <p className="text-fg-secondary text-sm">
                No reading history yet — open a chapter to start tracking progress.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-7xl">
              {recentProgress.map((p, i) => (
                <ContinueReadingCard
                  key={p.id}
                  chapterId={p.chapterId}
                  displayNumber={p.displayNumber}
                  chapterIsEx={p.chapterIsEx}
                  chapterName={p.chapterName}
                  coverImageUrl={p.coverImageUrl}
                  mangaTitle={p.mangaTitle}
                  isNext={p.isNext}
                  className={i >= phoneShown ? "max-sm:hidden" : ""}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
