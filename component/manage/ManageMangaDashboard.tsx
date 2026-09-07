"use client";

import { useState } from "react";
import MangaCreateForm from "@/component/manga/MangaCreateForm";
import AdminMangaRow from "@/component/admin/AdminMangaRow";

interface ChapterItem {
  id: string;
  mangaId: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
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

interface ManageMangaDashboardProps {
  mangaList: MangaItem[];
  chapters: ChapterItem[];
  arcs: ArcOption[];
  authorName: string;
}

// Trimmed version of AdminDashboard's "Manga" tab, scoped to one author's
// own manga — no Users/Comments tabs, since those stay admin-only. Reuses
// AdminMangaRow as-is: the admin CRUD API routes now accept authors too,
// scoped to manga they own.
export default function ManageMangaDashboard({ mangaList, chapters, arcs, authorName }: ManageMangaDashboardProps) {
  const [expandedMangaId, setExpandedMangaId] = useState<string | null>(null);
  const [editingMangaId, setEditingMangaId] = useState<string | null>(null);

  function toggleExpand(mangaId: string) {
    setExpandedMangaId((current) => (current === mangaId ? null : mangaId));
  }

  function toggleEdit(mangaId: string) {
    setEditingMangaId((current) => (current === mangaId ? null : mangaId));
  }

  return (
    <section>
      <MangaCreateForm />

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
                  chapterName: c.chapterName,
                  publishedDate: c.publishedDate,
                  coverImageUrl: c.coverImageUrl,
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
    </section>
  );
}
