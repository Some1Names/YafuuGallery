"use client";

import { useMemo, useState } from "react";
import MangaCreateForm from "@/component/manga/MangaCreateForm";
import AdminMangaRow from "@/component/admin/AdminMangaRow";
import AdminSearchInput from "@/component/admin/AdminSearchInput";
import AdminCommentRow from "@/component/admin/AdminCommentRow";
import type { ChapterTranslationDraft } from "@/component/admin/AdminChapterPdfUploads";

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

interface MangaItem {
  id: string;
  title: string;
  synopsis: string;
  chapterCount: number;
  viewCount: number;
  favoriteCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
}

interface CommentItem {
  id: string;
  body: string;
  userName: string;
  userTag: string | null;
  chapterLabel: string;
  createdAt: Date;
  hidden: boolean;
  reportCount: number;
}

interface ManageMangaDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  comments: CommentItem[];
  authorName: string;
}

type Tab = "manga" | "comments";

// Trimmed version of AdminDashboard scoped to one author's own manga: the
// Manga tab (reusing AdminMangaRow as-is — the admin CRUD API routes
// accept authors too, scoped to manga they own) plus a Comments tab for
// comments left on their manga, which they can hide/unhide but not delete.
// No Users tab — that stays admin-only.
export default function ManageMangaDashboard({
  mangaList,
  chapters,
  arcs,
  comments,
  authorName,
}: ManageMangaDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("manga");
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);
  const [mangaSearch, setMangaSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [reportedOnly, setReportedOnly] = useState(false);
  const reportedCount = comments.filter((c) => c.reportCount > 0).length;

  const filteredMangaList = useMemo(() => {
    const q = mangaSearch.trim().toLowerCase();
    if (!q) return mangaList;
    return mangaList.filter((m) => m.title.toLowerCase().includes(q));
  }, [mangaList, mangaSearch]);

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

  // At-a-glance totals across all of this author's manga (the rows below
  // only show them per manga).
  const stats = [
    { label: "Manga", value: mangaList.length },
    { label: "Chapters", value: mangaList.reduce((sum, m) => sum + m.chapterCount, 0) },
    { label: "Total views", value: mangaList.reduce((sum, m) => sum + m.viewCount, 0) },
    { label: "Favorites", value: mangaList.reduce((sum, m) => sum + m.favoriteCount, 0) },
  ];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "manga", label: "Manga", count: mangaList.length },
    { id: "comments", label: "Comments", count: comments.length },
  ];

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

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded-md p-4 bg-surface/60">
            <div className="text-2xl text-fg font-(family-name:--font-display)">{s.value.toLocaleString()}</div>
            <div className="text-xs text-fg-secondary mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Same tab treatment as AdminDashboard and the rest of the site. */}
      <div className="flex gap-6 mb-8 border-b border-fg/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={
                "relative pb-3 text-lg sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
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

      {activeTab === "comments" && (
        <section>
          <AdminSearchInput
            value={commentSearch}
            onChange={setCommentSearch}
            placeholder="Search by reader, chapter, or text…"
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
              <p className="text-fg-secondary text-sm">No comments on your manga yet.</p>
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
                  canDelete={false}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "manga" && (
        <section>
          <MangaCreateForm />

          {mangaList.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center">
              <p className="text-fg-secondary text-sm">No manga yet — create one above.</p>
            </div>
          ) : (
            <>
              <AdminSearchInput value={mangaSearch} onChange={setMangaSearch} placeholder="Search by title…" />

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
                      authorName={authorName}
                      chapterCount={m.chapterCount}
                      viewCount={m.viewCount}
                      favoriteCount={m.favoriteCount}
                      coverImageUrl={m.coverImageUrl}
                      bannerImageUrl={m.bannerImageUrl}
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
    </div>
  );
}
