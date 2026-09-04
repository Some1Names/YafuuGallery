"use client";

import { useState } from "react";
import ManageMangaCreateForm from "./ManageMangaCreateForm";
import AdminMangaRow from "@/component/admin/AdminMangaRow";

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

interface MangaItem {
  id: string;
  title: string;
  synopsis: string;
  chapterCount: number;
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

  function toggleExpand(mangaId: string) {
    setExpandedMangaId((current) => (current === mangaId ? null : mangaId));
  }

  return (
    <section>
      <ManageMangaCreateForm />

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
  );
}
