"use client";

import { Fragment, useMemo, useState } from "react";
import MangaCreateForm from "@/component/manga/MangaCreateForm";
import AdminMangaRow from "./AdminMangaRow";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import AdminUserDeleteButton from "./AdminUserDeleteButton";
import AdminCommentRow from "./AdminCommentRow";
import AdminSearchInput from "./AdminSearchInput";
import { formatUsername } from "@/lib/format-username";
import type { ChapterTranslationDraft } from "./AdminChapterPdfUploads";

interface MangaItem {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
  viewCount: number;
  favoriteCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  genres: string[];
  status: "ongoing" | "completed";
  isFeatured: boolean;
  storageBytes: number;
}

interface ChapterItem {
  id: string;
  mangaId: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
  translations: ChapterTranslationDraft[];
  favoriteCount: number;
  commentCount: number;
  storageBytes: number;
}

interface ArcOption {
  id: string;
  arc_name: string;
  arc_order: number;
  arc_is_ex: boolean;
  arc_status: "ongoing" | "completed";
  arc_image_url: string | null;
  manga_id: string;
}

interface UserItem {
  id: string;
  name: string | null;
  tag: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  created_at: Date;
}

interface CommentItem {
  id: string;
  userId: string;
  body: string;
  userName: string;
  userTag: string | null;
  chapterLabel: string;
  createdAt: Date;
  hidden: boolean;
  reportCount: number;
}

interface AdminDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  users: UserItem[];
  comments: CommentItem[];
  currentUserId: string;
}

type Tab = "manga" | "users" | "comments";

export default function AdminDashboard({
  mangaList,
  chapters,
  arcs,
  users,
  comments,
  currentUserId,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("manga");
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const [mangaSearch, setMangaSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [reportedOnly, setReportedOnly] = useState(false);
  const reportedCount = comments.filter((c) => c.reportCount > 0).length;

  const filteredMangaList = useMemo(() => {
    const q = mangaSearch.trim().toLowerCase();
    if (!q) return mangaList;
    return mangaList.filter(
      (m) => m.title.toLowerCase().includes(q) || m.authorName.toLowerCase().includes(q)
    );
  }, [mangaList, mangaSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => (u.name ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const filteredComments = useMemo(() => {
    const q = commentSearch.trim().toLowerCase();
    const pool = reportedOnly ? comments.filter((c) => c.reportCount > 0) : comments;
    if (!q) return pool;
    return pool.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        c.chapterLabel.toLowerCase().includes(q) ||
        c.body.toLowerCase().includes(q)
    );
  }, [comments, commentSearch, reportedOnly]);

  // A manga's title-edit form and its Arc/Chapters panel are mutually
  // exclusive across the WHOLE list, not just within one row — opening
  // one on any manga closes the other wherever it currently is, so
  // clicking Edit on manga B while manga A is expanded doesn't leave both
  // visible at once.
  function toggleExpand(mangaId: string) {
    setExpandedMangaId((current) => {
      const next = current === mangaId ? null : mangaId;
      if (next !== null) setEditingMangaId(null);
      return next;
    });
  }

  function toggleEdit(mangaId: string) {
    setEditingMangaId((current) => {
      const next = current === mangaId ? null : mangaId;
      if (next !== null) setExpandedMangaId(null);
      return next;
    });
  }

  function toggleUserComments(userId: string) {
    setExpandedUserId((current) => (current === userId ? null : userId));
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "manga", label: "Manga", count: mangaList.length },
    { id: "users", label: "Users", count: users.length },
    { id: "comments", label: "Comments", count: comments.length },
  ];

  return (
    <div>
      {/* Tabs — client-side only, same as the manga detail page's
          Chapters/Arcs switcher, so switching sections doesn't reload
          the page (everything's already fetched up front). Same look as
          that switcher, the Favorites tabs, and the navbar: display face,
          count beside the label, 2px ink bar under the active tab.
          aria-pressed toggles rather than role="tab", which would promise
          arrow-key navigation this doesn't implement. */}
      {/* Tab row: slightly smaller on phones so it fits a 375px screen, and
          sideways-scrollable as a fallback on anything narrower (the border
          and active bar live on the inner row, so the scroller can't clip them). */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none]">
      <div className="flex gap-4 sm:gap-6 border-b border-fg/10 w-max min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={
                "relative pb-3 whitespace-nowrap text-base sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
                (isActive ? "text-fg" : "text-fg-muted hover:text-fg-secondary")
              }
            >
              {tab.label}
              <span className="ml-2 align-middle text-xs font-(family-name:--font-body) font-medium">{tab.count}</span>
              {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />}
            </button>
          );
        })}
      </div>
      </div>

      {activeTab === "manga" && (
        <section>
          <MangaCreateForm />

          {mangaList.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center">
              <p className="text-fg-secondary text-sm">No manga yet — create one above.</p>
            </div>
          ) : (
            <>
              <AdminSearchInput value={mangaSearch} onChange={setMangaSearch} placeholder="Search by title or author…" />

              {filteredMangaList.length === 0 ? (
                <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center mt-4">
                  <p className="text-fg-secondary text-sm">No manga match &quot;{mangaSearch}&quot;.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  {filteredMangaList.map((m) => (
                    <AdminMangaRow
                      key={m.id}
                      id={m.id}
                      title={m.title}
                      synopsis={m.synopsis}
                      authorName={m.authorName}
                      chapterCount={m.chapterCount}
                      viewCount={m.viewCount}
                      favoriteCount={m.favoriteCount}
                      coverImageUrl={m.coverImageUrl}
                      bannerImageUrl={m.bannerImageUrl}
                      genres={m.genres}
                      status={m.status}
                      isAdmin
                      isFeatured={m.isFeatured}
                      storageBytes={m.storageBytes}
                      chapters={chapters
                        .filter((c) => c.mangaId === m.id)
                        .map((c) => ({
                          id: c.id,
                          arcId: c.arcId,
                          arcName: c.arcName,
                          chapterNumber: c.chapterNumber,
                          chapterIsEx: c.chapterIsEx,
                          chapterName: c.chapterName,
                          publishedDate: c.publishedDate,
                          coverImageUrl: c.coverImageUrl,
                          translations: c.translations,
                          favoriteCount: c.favoriteCount,
                          commentCount: c.commentCount,
                          storageBytes: c.storageBytes,
                        }))}
                      arcs={arcs
                        .filter((a) => a.manga_id === m.id)
                        .map((a) => ({
                          id: a.id,
                          arc_name: a.arc_name,
                          arc_order: a.arc_order,
                          arc_is_ex: a.arc_is_ex,
                          arc_status: a.arc_status,
                          arc_image_url: a.arc_image_url,
                        }))}
                      isExpanded={expandedMangaId === m.id}
                      onToggleExpand={() => toggleExpand(m.id)}
                      isEditing={editingMangaId === m.id}
                      onToggleEdit={() => toggleEdit(m.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {activeTab === "users" && (
        <section>
          <AdminSearchInput value={userSearch} onChange={setUserSearch} placeholder="Search by name or email…" />

          <div className="border border-border rounded-md overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-fg-secondary text-xs">
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Joined</th>
                    <th className="text-left px-4 py-2">Role</th>
                    <th className="text-left px-4 py-2">Comments</th>
                    <th className="text-left px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-fg-secondary">
                        No users match &quot;{userSearch}&quot;.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((u) => {
                    const userComments = comments.filter((c) => c.userId === u.id);
                    const isExpanded = expandedUserId === u.id;

                    return (
                      <Fragment key={u.id}>
                        <tr className="border-t border-border hover:bg-surface/40 transition-colors duration-200">
                          <td className="px-4 py-2 text-fg whitespace-nowrap">
                            {u.name ? formatUsername(u.name, u.tag) : "—"}
                          </td>
                          <td className="px-4 py-2 text-fg-secondary whitespace-nowrap">{u.email}</td>
                          <td className="px-4 py-2 text-fg-secondary whitespace-nowrap">
                            {u.created_at.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-2">
                            {/* No dropdown on your own row — changing your
                                own role would drop your admin access
                                instantly (the API refuses it too). */}
                            {u.id === currentUserId ? (
                              <span className="text-sm text-fg-secondary whitespace-nowrap">
                                {u.role === "admin" ? "Admin" : u.role === "author" ? "Author" : "Reader"} (you)
                              </span>
                            ) : (
                              <AdminUserRoleSelect
                                userId={u.id}
                                currentRole={u.role}
                                userLabel={u.name ? formatUsername(u.name, u.tag) : u.email}
                              />
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => toggleUserComments(u.id)}
                              disabled={userComments.length === 0}
                              className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary disabled:opacity-40 disabled:hover:text-fg-secondary disabled:hover:border-border transition-colors duration-200"
                            >
                              {userComments.length} {isExpanded ? "− Close" : "· View"}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            {u.id !== currentUserId && (
                              <AdminUserDeleteButton
                                userId={u.id}
                                userLabel={u.name ? formatUsername(u.name, u.tag) : u.email}
                              />
                            )}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-t border-border bg-bg/40">
                            <td colSpan={6} className="p-3">
                              <div className="flex flex-col gap-2">
                                {userComments.map((c) => (
                                  <AdminCommentRow
                                    key={c.id}
                                    commentId={c.id}
                                    body={c.body}
                                    userName={c.userName}
                                    userTag={c.userTag}
                                    chapterLabel={c.chapterLabel}
                                    createdAt={c.createdAt}
                                    initialHidden={c.hidden}
                  reportCount={c.reportCount}
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === "comments" && (
        <section>
          <AdminSearchInput
            value={commentSearch}
            onChange={setCommentSearch}
            placeholder="Search by user, chapter, or text…"
          />
        {/* Moderation shortcut: just the comments readers have reported. */}
        <button
          type="button"
          onClick={() => setReportedOnly((v) => !v)}
          aria-pressed={reportedOnly}
          className={
            "mt-3 text-xs px-3 py-1.5 rounded border transition-colors duration-200 " +
            (reportedOnly
              ? "border-danger/60 text-danger"
              : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
          }
        >
          Reported only ({reportedCount})
        </button>

          {comments.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center mt-4">
              <p className="text-fg-secondary text-sm">No comments yet.</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center mt-4">
              <p className="text-fg-secondary text-sm">{commentSearch ? <>No comments match &quot;{commentSearch}&quot;.</> : "No reported comments."}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              {filteredComments.map((c) => (
                <AdminCommentRow
                  key={c.id}
                  commentId={c.id}
                  body={c.body}
                  userName={c.userName}
                  userTag={c.userTag}
                  chapterLabel={c.chapterLabel}
                  createdAt={c.createdAt}
                  initialHidden={c.hidden}
                  reportCount={c.reportCount}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
