"use client";

import { useState } from "react";
import AdminMangaCreateForm from "./AdminMangaCreateForm";
import AdminMangaRow from "./AdminMangaRow";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import AdminUserDeleteButton from "./AdminUserDeleteButton";
import AdminCommentRow from "./AdminCommentRow";

interface MangaItem {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
}

interface ChapterItem {
  id: string;
  mangaId: string;
  arcName: string | null;
  chapterNumber: number;
  chapterName: string;
  publishedDate: Date;
}

interface ArcOption {
  id: string;
  arc_name: string;
  arc_order: number;
  arc_status: "ongoing" | "completed";
  manga_id: string;
}

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  created_at: Date;
}

interface CommentItem {
  id: string;
  body: string;
  userName: string;
  chapterLabel: string;
  createdAt: Date;
  hidden: boolean;
}

interface AdminDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  users: UserItem[];
  recentComments: CommentItem[];
  currentUserId: string;
}

type Tab = "manga" | "users" | "comments";

export default function AdminDashboard({
  mangaList,
  chapters,
  arcs,
  users,
  recentComments,
  currentUserId,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("manga");
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);

  function toggleExpand(mangaId: string) {
    setExpandedMangaId((current) => (current === mangaId ? null : mangaId));
  }

  const tabClass = (isActive: boolean) =>
    "px-4 py-1.5 rounded text-sm transition-colors duration-200 " +
    (isActive ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]");

  return (
    <div>
      {/* Tabs — client-side only, same as the manga detail page's
          Chapters/Arcs switcher, so switching sections doesn't reload
          the page (everything's already fetched up front) */}
      <div className="inline-flex items-center gap-1 p-1 mb-8 rounded-md border border-[#050505] bg-[#1b1a1c]">
        <button type="button" onClick={() => setActiveTab("manga")} className={tabClass(activeTab === "manga")}>
          Manga
          <span className="ml-1.5 text-xs text-[#6b655e]">{mangaList.length}</span>
        </button>
        <button type="button" onClick={() => setActiveTab("users")} className={tabClass(activeTab === "users")}>
          Users
          <span className="ml-1.5 text-xs text-[#6b655e]">{users.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={tabClass(activeTab === "comments")}
        >
          Comments
          <span className="ml-1.5 text-xs text-[#6b655e]">{recentComments.length}</span>
        </button>
      </div>

      {activeTab === "manga" && (
        <section>
          <AdminMangaCreateForm authors={users} />

          {mangaList.length === 0 ? (
            <div className="border border-[#050505] rounded-md bg-[#1b1a1c]/60 py-12 px-6 text-center">
              <p className="text-[#b6b0a2] text-sm">No manga yet — create one above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mangaList.map((m) => (
                <AdminMangaRow
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  synopsis={m.synopsis}
                  authorName={m.authorName}
                  chapterCount={m.chapterCount}
                  coverImageUrl={m.coverImageUrl}
                  bannerImageUrl={m.bannerImageUrl}
                  chapters={chapters
                    .filter((c) => c.mangaId === m.id)
                    .map((c) => ({
                      id: c.id,
                      arcName: c.arcName,
                      chapterNumber: c.chapterNumber,
                      chapterName: c.chapterName,
                      publishedDate: c.publishedDate,
                    }))}
                  arcs={arcs
                    .filter((a) => a.manga_id === m.id)
                    .map((a) => ({
                      id: a.id,
                      arc_name: a.arc_name,
                      arc_order: a.arc_order,
                      arc_status: a.arc_status,
                    }))}
                  isExpanded={expandedMangaId === m.id}
                  onToggleExpand={() => toggleExpand(m.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "users" && (
        <section>
          <div className="border border-[#050505] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1b1a1c] text-[#b6b0a2] text-xs uppercase">
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Joined</th>
                    <th className="text-left px-4 py-2">Role</th>
                    <th className="text-left px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-[#050505] hover:bg-[#1b1a1c]/40 transition-colors duration-200">
                      <td className="px-4 py-2 text-[#ece6d8] whitespace-nowrap">{u.name ?? "—"}</td>
                      <td className="px-4 py-2 text-[#b6b0a2] whitespace-nowrap">{u.email}</td>
                      <td className="px-4 py-2 text-[#b6b0a2] whitespace-nowrap">
                        {u.created_at.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2">
                        <AdminUserRoleSelect userId={u.id} currentRole={u.role} />
                      </td>
                      <td className="px-4 py-2">
                        {u.id !== currentUserId && (
                          <AdminUserDeleteButton userId={u.id} userLabel={u.name ?? u.email} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === "comments" && (
        <section>
          {recentComments.length === 0 ? (
            <div className="border border-[#050505] rounded-md bg-[#1b1a1c]/60 py-12 px-6 text-center">
              <p className="text-[#b6b0a2] text-sm">No comments yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentComments.map((c) => (
                <AdminCommentRow
                  key={c.id}
                  commentId={c.id}
                  body={c.body}
                  userName={c.userName}
                  chapterLabel={c.chapterLabel}
                  createdAt={c.createdAt}
                  initialHidden={c.hidden}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
