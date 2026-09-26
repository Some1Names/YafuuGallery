"use client";

import { useMemo, useState } from "react";
import MangaCreateForm from "@/component/manga/MangaCreateForm";
import AdminMangaRow from "./AdminMangaRow";
import AdminSearchInput from "./AdminSearchInput";
import AdminUserList from "./AdminUserList";
import AdminCommentList from "./AdminCommentList";
import type { ChapterTranslationDraft } from "./AdminChapterPdfUploads";
import { useTranslations } from "next-intl";

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
  readingDirection: "rtl" | "ltr";
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

interface AdminDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  // Users and Comments are loaded a page at a time by their own tabs (see
  // AdminUserList / AdminCommentList); the page only passes the counts.
  userCount: number;
  commentCount: number;
  reportedCount: number;
  currentUserId: string;
}

type Tab = "manga" | "users" | "comments";

export default function AdminDashboard({
  mangaList,
  chapters,
  arcs,
  userCount,
  commentCount,
  reportedCount,
  currentUserId,
}: AdminDashboardProps) {
  const t = useTranslations("Dashboard");
  const [activeTab, setActiveTab] = useState<Tab>("manga");
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);

  const [mangaSearch, setMangaSearch] = useState("");

  const filteredMangaList = useMemo(() => {
    const q = mangaSearch.trim().toLowerCase();
    if (!q) return mangaList;
    return mangaList.filter(
      (m) => m.title.toLowerCase().includes(q) || m.authorName.toLowerCase().includes(q)
    );
  }, [mangaList, mangaSearch]);

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

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "manga", label: t("tabs.manga"), count: mangaList.length },
    { id: "users", label: t("tabs.users"), count: userCount },
    { id: "comments", label: t("tabs.comments"), count: commentCount },
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

      {activeTab === "manga" && (
        <section>
          <MangaCreateForm />

          {mangaList.length === 0 ? (
            <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center">
              <p className="text-fg-secondary text-sm">{t("noManga")}</p>
            </div>
          ) : (
            <>
              <AdminSearchInput value={mangaSearch} onChange={setMangaSearch} placeholder={t("searchTitleOrAuthor")} />

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
                      readingDirection={m.readingDirection}
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

      {activeTab === "users" && <AdminUserList currentUserId={currentUserId} />}

      {activeTab === "comments" && (
        <section>
          <AdminCommentList reportedTotal={reportedCount} />
        </section>
      )}
    </div>
  );
}
