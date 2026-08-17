import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminUserRoleSelect from "@/component/admin/AdminUserRoleSelect";
import AdminCommentRow from "@/component/admin/AdminCommentRow";

export default async function AdminPage() {
  const session = await auth();

  // not signed in, or signed in but not an admin — either way, no access.
  // redirect rather than a blank page, so it doesn't hint the route exists
//   // for non-admins probing around.

//   if (session?.user?.role !== "admin") {
//     redirect("/");
//   }

  const [userCount, mangaCount, chapterCount, commentCount, users, recentComments] =
    await Promise.all([
      prisma.user.count(),
      prisma.manga.count(),
      prisma.chapter.count(),
      prisma.comment.count(),
      prisma.user.findMany({
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, email: true, role: true, created_at: true },
      }),
      prisma.comment.findMany({
        orderBy: { created_at: "desc" },
        take: 30,
        include: {
          user: { select: { name: true } },
          chapter: {
            select: {
              chapter_number: true,
              manga: { select: { manga_title: true } },
            },
          },
        },
      }),
    ]);

  const stats = [
    { label: "Users", value: userCount },
    { label: "Manga", value: mangaCount },
    { label: "Chapters", value: chapterCount },
    { label: "Comments", value: commentCount },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-8 py-12">
      <div className="max-w-350 mx-auto">
        <h1 className="text-3xl text-[#ece6d8] font-(family-name:--font-display) mb-8">Admin</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="border border-[#050505] rounded-md p-4 bg-[#1b1a1c]">
              <div className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">{s.value}</div>
              <div className="text-xs text-[#b6b0a2] font-mono uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users */}
        <section className="mb-12">
          <h2 className="text-xl text-[#ece6d8] font-(family-name:--font-display) mb-4">Users</h2>
          <div className="border border-[#050505] rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1b1a1c] text-[#b6b0a2] font-mono text-xs uppercase">
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Joined</th>
                  <th className="text-left px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[#050505]">
                    <td className="px-4 py-2 text-[#ece6d8]">{u.name ?? "—"}</td>
                    <td className="px-4 py-2 text-[#b6b0a2]">{u.email}</td>
                    <td className="px-4 py-2 text-[#b6b0a2] font-mono">
                      {u.created_at.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <AdminUserRoleSelect userId={u.id} currentRole={u.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comment moderation */}
        <section>
          <h2 className="text-xl text-[#ece6d8] font-(family-name:--font-display) mb-4">
            Recent comments
          </h2>
          {recentComments.length === 0 ? (
            <p className="text-sm text-[#b6b0a2] font-mono">No comments yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentComments.map((c) => (
                <AdminCommentRow
                  key={c.id}
                  commentId={c.id}
                  body={c.body}
                  userName={c.user.name ?? "Unknown"}
                  chapterLabel={`${c.chapter.manga.manga_title} #${String(c.chapter.chapter_number).padStart(3, "0")}`}
                  createdAt={c.created_at}
                  initialHidden={c.hidden_at !== null}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}