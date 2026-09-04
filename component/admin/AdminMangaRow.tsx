"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminImageUploadButton from "./AdminImageUploadButton";
import AdminChapterCreateForm from "./AdminChapterCreateForm";
import AdminChapterRow from "./AdminChapterRow";
import AdminArcCreateForm from "./AdminArcCreateForm";
import AdminArcRow from "./AdminArcRow";

interface ChapterItem {
  id: string;
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
}

interface AdminMangaRowProps {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  chapters: ChapterItem[];
  arcs: ArcOption[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function AdminMangaRow({
  id,
  title,
  synopsis,
  authorName,
  chapterCount,
  coverImageUrl,
  bannerImageUrl,
  chapters,
  arcs,
  isExpanded,
  onToggleExpand,
}: AdminMangaRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSynopsis, setEditSynopsis] = useState(synopsis);
  const [editCoverImageUrl, setEditCoverImageUrl] = useState(coverImageUrl);
  const [editBannerImageUrl, setEditBannerImageUrl] = useState(bannerImageUrl);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    const res = await fetch(`/api/admin/manga/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manga_title: editTitle,
        manga_synopsis: editSynopsis,
        cover_image_url: editCoverImageUrl,
        banner_image_url: editBannerImageUrl,
      }),
    });
    setIsSaving(false);
    if (res.ok) {
      setIsEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm(`Delete "${title}"? This deletes all its arcs and chapters too. This can't be undone.`)) return;
    const res = await fetch(`/api/admin/manga/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  if (isEditing) {
    return (
      <div className="border border-[#9c1d25] rounded-md p-3 bg-[#1b1a1c] flex flex-col gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-[6rem_1fr] gap-3">
          <AdminImageUploadButton
            label="Cover"
            value={editCoverImageUrl}
            onChange={setEditCoverImageUrl}
            aspectClassName="aspect-2/3"
          />
          <AdminImageUploadButton
            label="Banner"
            value={editBannerImageUrl}
            onChange={setEditBannerImageUrl}
            aspectClassName="aspect-32/9"
          />
        </div>

        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8]"
        />
        <textarea
          value={editSynopsis}
          onChange={(e) => setEditSynopsis(e.target.value)}
          rows={2}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8] resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={isSaving}
            className="text-xs font-mono px-3 py-1.5 bg-[#ece6d8] text-[#0a0a0a] rounded disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs font-mono px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#050505] rounded-md bg-[#1b1a1c] overflow-hidden">
      <div className="p-3 flex items-center gap-4">
        {/* Expand/collapse — the chapter CRUD for this manga lives below,
            revealed here instead of a separate top-level Chapters tab */}
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Hide chapters" : "Show chapters"}
          className={
            "shrink-0 text-[#6b655e] hover:text-[#ece6d8] transition-transform duration-200 " +
            (isExpanded ? "rotate-90" : "")
          }
        >
          ▸
        </button>

        <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-[#0a0a0a] border border-[#050505]">
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/manga/titles/${id}`} className="text-sm text-[#ece6d8] hover:underline font-medium">
            {title}
          </Link>
          <p className="text-xs text-[#b6b0a2] mt-0.5">
            {authorName} ·{" "}
            <button
              type="button"
              onClick={onToggleExpand}
              className="hover:text-[#ece6d8] hover:underline transition-colors duration-200"
            >
              {chapterCount} chapters
            </button>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-mono px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={remove}
            className="text-xs font-mono px-3 py-1.5 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#050505] p-3 flex flex-col gap-4 bg-[#0a0a0a]/40">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6b655e] font-mono">Arcs</p>
            <AdminArcCreateForm
              mangaId={id}
              nextOrder={arcs.length === 0 ? 0 : Math.max(...arcs.map((a) => a.arc_order)) + 1}
            />

            {arcs.length === 0 ? (
              <p className="text-xs text-[#6b655e] font-mono text-center py-4">
                No arcs yet — create one above.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {arcs
                  .slice()
                  .sort((a, b) => a.arc_order - b.arc_order)
                  .map((a) => (
                    <AdminArcRow
                      key={a.id}
                      id={a.id}
                      name={a.arc_name}
                      order={a.arc_order}
                      status={a.arc_status}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6b655e] font-mono">Chapters</p>
            <AdminChapterCreateForm mangaId={id} arcs={arcs} />

            {chapters.length === 0 ? (
              <p className="text-xs text-[#6b655e] font-mono text-center py-4">
                No chapters yet — create one above.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {chapters.map((c) => (
                  <AdminChapterRow
                    key={c.id}
                    id={c.id}
                    arcName={c.arcName}
                    chapterNumber={c.chapterNumber}
                    chapterName={c.chapterName}
                    publishedDate={c.publishedDate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
