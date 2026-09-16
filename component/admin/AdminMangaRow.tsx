"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Heart, ChevronDown } from "lucide-react";
import AdminImageUploadButton from "./AdminImageUploadButton";
import AdminChapterCreateForm from "./AdminChapterCreateForm";
import AdminChapterList from "./AdminChapterList";
import AdminArcCreateForm from "./AdminArcCreateForm";
import AdminArcList from "./AdminArcList";

interface ChapterItem {
  id: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  pdfFileName: string | null;
}

interface ArcOption {
  id: string;
  arc_name: string;
  arc_order: number;
  arc_is_ex: boolean;
  arc_status: "ongoing" | "completed";
  arc_image_url: string | null;
}

interface AdminMangaRowProps {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
  viewCount: number;
  favoriteCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  chapters: ChapterItem[];
  arcs: ArcOption[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function AdminMangaRow({
  id,
  title,
  synopsis,
  authorName,
  viewCount,
  favoriteCount,
  coverImageUrl,
  bannerImageUrl,
  chapters,
  arcs,
  isExpanded,
  onToggleExpand,
  isEditing,
  onToggleEdit,
}: AdminMangaRowProps) {
  const router = useRouter();
  const [editTitle, setEditTitle] = useState(title);
  const [editSynopsis, setEditSynopsis] = useState(synopsis);
  const [editCoverImageUrl, setEditCoverImageUrl] = useState(coverImageUrl);
  const [editBannerImageUrl, setEditBannerImageUrl] = useState(bannerImageUrl);
  const [isSaving, setIsSaving] = useState(false);

  // The arc create form and an arc row's edit form are mutually
  // exclusive — opening one closes the other, so at most one arc-related
  // form is ever visible at a time.
  const [arcCreateOpen, setArcCreateOpen] = useState(false);
  const [editingArcId, setEditingArcId] = useState<string | null>(null);

  function handleArcCreateOpenChange(open: boolean) {
    setArcCreateOpen(open);
    if (open) setEditingArcId(null);
  }

  function handleToggleArcEdit(arcId: string) {
    setEditingArcId((current) => (current === arcId ? null : arcId));
    setArcCreateOpen(false);
  }

  // Same mutual-exclusion pattern for the Chapters section, independent
  // of the Arc section's own state above.
  const [chapterCreateOpen, setChapterCreateOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // Arc and Chapters are tabs, not stacked sections — only one is on
  // screen at a time. The tab switcher itself is the expand control: it
  // sits where a plain expand chevron used to, so picking a tab both
  // opens the section and selects it; clicking the tab that's already
  // open and active collapses the row instead.
  const [activeSection, setActiveSection] = useState<"arc" | "chapters">("arc");

  function handleTabClick(section: "arc" | "chapters") {
    if (isExpanded && activeSection === section) {
      onToggleExpand();
      return;
    }
    if (!isExpanded) onToggleExpand();
    setActiveSection(section);
  }

  function handleChapterCreateOpenChange(open: boolean) {
    setChapterCreateOpen(open);
    if (open) setEditingChapterId(null);
  }

  function handleToggleChapterEdit(chapterId: string) {
    setEditingChapterId((current) => (current === chapterId ? null : chapterId));
    setChapterCreateOpen(false);
  }

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
      onToggleEdit();
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="border border-[#050505] rounded-md p-12 bg-[#1b1a1c] flex flex-col gap-4"
      >
        <h3 className="text-lg text-[#ece6d8] font-(family-name:--font-display)">Edit Manga Title</h3>

        {/* Same layout as the create form — one shared grid, 3fr:16fr
            columns, label/field rows col-span the full row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-[3fr_16fr] gap-x-7 gap-y-4">
          <AdminImageUploadButton
            label="Cover"
            value={editCoverImageUrl}
            onChange={setEditCoverImageUrl}
            boxClassName="w-full aspect-2/3"
          />
          <AdminImageUploadButton
            label="Banner"
            value={editBannerImageUrl}
            onChange={setEditBannerImageUrl}
            boxClassName="w-full aspect-32/9"
          />

          <label className="col-span-2 sm:col-span-1 text-[10px] uppercase tracking-widest text-[#6b655e] sm:pt-2">
            Manga Title
          </label>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            className="col-span-2 sm:col-span-1 w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
          />

          <label className="col-span-2 sm:col-span-1 text-[10px] uppercase tracking-widest text-[#6b655e] sm:pt-2">
            Synopsis
          </label>
          <textarea
            value={editSynopsis}
            onChange={(e) => setEditSynopsis(e.target.value)}
            required
            rows={3}
            className="col-span-2 sm:col-span-1 w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8] resize-none"
          />
        </div>

        <div className="flex gap-2 self-end">
          <button
            type="button"
            onClick={onToggleEdit}
            className="px-4 py-2 border border-[#050505] rounded-md text-sm text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="border border-[#050505] rounded-md bg-[#1b1a1c] overflow-hidden">
      {/* Cover — flush against the row's left/top/bottom edges. Stretches
          (flex default) to match whatever height the content column needs,
          so there's never a gap below it; object-cover on the img crops it
          to fill that box without distorting the art. */}
      <div className="flex">
        <div className="w-24 sm:w-32 shrink-0 bg-[#0a0a0a]">
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col">
          {/* Header row */}
          <div className="p-8 flex-1 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <Link href={`/manga/titles/${id}`} className="text-lg text-[#ece6d8] hover:underline font-medium">
                {title}
              </Link>
              <p className="text-sm text-[#b6b0a2] mt-0.5">{authorName}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#6b655e]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {favoriteCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={onToggleEdit}
                className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={remove}
                className="text-xs px-3 py-1.5 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Divider + footer row — the Arc/Chapters tab switcher IS the
              expand control here (no separate generic chevron button):
              picking a tab opens the row to that section, and each tab
              carries its own chevron (rotated when it's the open, active
              one) instead of one shared toggle. */}
          <div className="px-8 py-3 border-t border-[#050505] flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleTabClick("arc")}
              aria-expanded={isExpanded && activeSection === "arc"}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors duration-200 ${
                isExpanded && activeSection === "arc"
                  ? "bg-[#232224] text-[#ece6d8]"
                  : "text-[#b6b0a2] hover:text-[#ece6d8]"
              }`}
            >
              Arc
              <span className="text-xs text-[#6b655e]">{arcs.length}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded && activeSection === "arc" ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => handleTabClick("chapters")}
              aria-expanded={isExpanded && activeSection === "chapters"}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors duration-200 ${
                isExpanded && activeSection === "chapters"
                  ? "bg-[#232224] text-[#ece6d8]"
                  : "text-[#b6b0a2] hover:text-[#ece6d8]"
              }`}
            >
              Chapters
              <span className="text-xs text-[#6b655e]">{chapters.length}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded && activeSection === "chapters" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#050505] p-12 flex flex-col gap-4 bg-[#0a0a0a]/40">
          {activeSection === "arc" && (
            <div className="flex flex-col gap-4">
              <AdminArcCreateForm
                mangaId={id}
                totalCount={arcs.length}
                isOpen={arcCreateOpen}
                onOpenChange={handleArcCreateOpenChange}
              />

              <AdminArcList
                mangaId={id}
                arcs={arcs}
                editingArcId={editingArcId}
                onToggleEdit={handleToggleArcEdit}
              />
            </div>
          )}

          {activeSection === "chapters" && (
            <div className="flex flex-col gap-4">
              <AdminChapterCreateForm
                mangaId={id}
                arcs={arcs}
                totalCount={chapters.length}
                isOpen={chapterCreateOpen}
                onOpenChange={handleChapterCreateOpenChange}
              />

              <AdminChapterList
                mangaId={id}
                chapters={chapters}
                arcs={arcs}
                editingChapterId={editingChapterId}
                onToggleEdit={handleToggleChapterEdit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
