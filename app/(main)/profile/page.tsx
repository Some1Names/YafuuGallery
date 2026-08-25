import ProfileEditForm from "@/component/profile/ProfileEditForm";
import MangaCard from "@/component/MangaCard";

// TEMPORARY: hardcoded mock data so this page is viewable without a working
// login flow. Swap this whole block back for the real auth() + Prisma
// fetches (commented out below it) once login/signup is finished — don't
// forget the redirect("/login") guard needs to come back too.

const user = {
  name: "Uefa",
  email: "uefa@example.com",
  image: null as string | null,
  role: "author" as "reader" | "author" | "admin",
  created_at: new Date("2025-03-01"),
};

const bookmarkCount = 12;
const chapterFavoriteCount = 34;
const commentCount = 7;
const authoredCount = 2;

// 5 entries so both breakpoints have something to show — mobile shows the
// first 2, desktop shows all 5
const recentProgress = [
  {
    id: "mock-1",
    updated_at: new Date("2026-08-16"),
    chapter: { number: 5, name: "The Choice" },
    manga: { id: "mock-manga-1", title: "Dome Disaster", author: "N0tH1ma", cover: null as string | null },
  },
  {
    id: "mock-2",
    updated_at: new Date("2026-08-14"),
    chapter: { number: 12, name: "Veil" },
    manga: { id: "mock-manga-2", title: "Choujin X", author: "Sui Ishida", cover: null as string | null },
  },
  {
    id: "mock-3",
    updated_at: new Date("2026-08-10"),
    chapter: { number: 3, name: "Uncrossed Paths" },
    manga: { id: "mock-manga-3", title: "Aftermath", author: "R. Kimura", cover: null as string | null },
  },
  {
    id: "mock-4",
    updated_at: new Date("2026-08-06"),
    chapter: { number: 8, name: "Liminal" },
    manga: { id: "mock-manga-4", title: "Wire Garden", author: "T. Ando", cover: null as string | null },
  },
  {
    id: "mock-5",
    updated_at: new Date("2026-08-01"),
    chapter: { number: 1, name: "Prelude" },
    manga: { id: "mock-manga-5", title: "Nightshade Row", author: "M. Furukawa", cover: null as string | null },
  },
];

/*
  Real implementation — restore this once auth is finished. Note the query
  shape below matches what MangaCard needs (author name, cover_image_url)
  rather than the old ReadingProgress-only shape:

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, bookmarkCount, chapterFavoriteCount, commentCount, authoredCount, recentProgressRaw] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, role: true, created_at: true },
      }),
      prisma.bookmark.count({ where: { user_id: userId } }),
      prisma.chapterBookmark.count({ where: { user_id: userId } }),
      prisma.comment.count({ where: { user_id: userId } }),
      prisma.manga.count({ where: { author_id: userId } }),
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
*/

export default async function ProfilePage() {
  const stats = [
    { label: "Manga favorited", value: bookmarkCount },
    { label: "Chapters favorited", value: chapterFavoriteCount },
    { label: "Comments", value: commentCount },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-8 py-12">
      <div className="max-w-225 mx-auto">
        <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-8">Profile</h1>

        {/* Identity + edit form */}
        <div className="border border-[#050505] rounded-md p-6 bg-[#1b1a1c]/60 mb-8">
          <ProfileEditForm
            initialName={user.name ?? ""}
            initialImage={user.image}
            email={user.email}
            role={user.role}
            createdAt={user.created_at}
            authoredCount={authoredCount}
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
            <p className="text-sm text-[#b6b0a2] font-mono">
              No reading history yet — open a chapter to start tracking progress.
            </p>
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