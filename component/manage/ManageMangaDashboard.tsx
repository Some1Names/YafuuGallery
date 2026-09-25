"use client";

import { useMemo, useState } from "react";
import MangaCreateForm from "@/component/manga/MangaCreateForm";
import AdminMangaRow from "@/component/admin/AdminMangaRow";
import AdminSearchInput from "@/component/admin/AdminSearchInput";
import AdminCommentList from "@/component/admin/AdminCommentList";
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
  genres: string[];
  status: "ongoing" | "completed";
}

interface ManageMangaDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  // Comments load a page at a time in their own tab (AdminCommentList,
  // scoped server-side to this author's manga); only the counts come in.
  commentCount: number;
  reportedCount: number;
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
  commentCount,
  reportedCount,
  authorName,
}: ManageMangaDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("manga");
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);
  const [mangaSearch, setMangaSearch] = useState("");

  const filteredMangaList = useMemo(() => {
    const q = mangaSearch.trim().toLowerCase();
    if (!q) return mangaList;
    return mangaList.filter((m) => m.title.toLowerCase().includes(q));
  }, [mangaList, mangaSearch]);

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
    { id: "comments", label: "Comments", count: commentCount },
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
      {/* Tab row: slightly smaller on phones so it fits a 375px screen, and
          sideways-scrollable as a fallback on anything narrower (the border
          and active bar live on the inner row, so the scroller can't clip them). */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none]">
      <div className="flex gap-3 min-[360px]:gap-4 sm:gap-6 border-b border-fg/10 w-max min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={
                "relative pb-3 whitespace-nowrap text-[15px] min-[360px]:text-base sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
                (isActive ? "text-fg" : "text-fg-muted hover:text-fg-secondary")
              }
            >
              {tab.label}
              <span className="ml-1.5 sm:ml-2 align-middle text-xs font-(family-name:--font-body) font-medium">{tab.count}</span>
              {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />}
            </button>
          );
        })}
      </div>
      </div>

      {activeTab === "comments" && (
        <section>
          <AdminCommentList
            canDelete={false}
            reportedTotal={reportedCount}
            searchPlaceholder="Search by reader, manga, or text…"
            emptyText="No comments on your manga yet."
          />
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
                      genres={m.genres}
                      status={m.status}
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
