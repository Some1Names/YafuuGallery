"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "./AdminImageUploadButton";

interface AdminChapterRowProps {
  id: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
  arcs: { id: string; arc_name: string }[];
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function AdminChapterRow({
  id,
  arcId,
  arcName,
  chapterNumber,
  chapterName,
  publishedDate,
  coverImageUrl,
  arcs,
  isEditing,
  onToggleEdit,
}: AdminChapterRowProps) {
  const router = useRouter();
  const [editCoverImageUrl, setEditCoverImageUrl] = useState(coverImageUrl);
  const [editArcId, setEditArcId] = useState(arcId ?? "");
  const [editNumber, setEditNumber] = useState(String(chapterNumber));
  const [editName, setEditName] = useState(chapterName);
  const [editDate, setEditDate] = useState(publishedDate.toISOString().slice(0, 10));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setIsSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/chapters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        arc_id: editArcId || null,
        chapter_number: Number(editNumber),
        chapter_name: editName,
        published_date: editDate,
        cover_image_url: editCoverImageUrl,
      }),
    });

    setIsSaving(false);

    if (res.ok) {
      onToggleEdit();
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to save.");
    }
  }

  async function remove() {
    if (!confirm(`Delete chapter #${String(chapterNumber).padStart(3, "0")} — "${chapterName}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/chapters/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  function cancelEdit() {
    setEditCoverImageUrl(coverImageUrl);
    setEditArcId(arcId ?? "");
    setEditNumber(String(chapterNumber));
    setEditName(chapterName);
    setEditDate(publishedDate.toISOString().slice(0, 10));
    setError(null);
    onToggleEdit();
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
        <div className="flex flex-col sm:flex-row gap-4">
          <AdminImageUploadButton
            label="Cover"
            value={editCoverImageUrl}
            onChange={setEditCoverImageUrl}
            boxClassName="w-40 sm:w-54 h-24 sm:h-30 shrink-0"
          />

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                Chapter Title
              </label>
              <div className="flex items-stretch bg-[#0a0a0a] border border-[#050505] rounded overflow-hidden focus-within:border-[#b6b0a2] transition-colors duration-200">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  className="w-16 shrink-0 bg-[#0a0a0a] border-r border-[#050505] pl-3 pr-1 text-sm text-[#b6b0a2] focus:outline-none"
                />
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-[#ece6d8] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                  Arc
                </label>
                <select
                  value={editArcId}
                  onChange={(e) => setEditArcId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
                >
                  <option value="">No arc</option>
                  {arcs.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.arc_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:w-40">
                <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                  Published Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

        <div className="flex gap-2 self-end">
          <button
            type="button"
            onClick={cancelEdit}
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
      {/* Same layout as AdminArcRow/AdminMangaRow's collapsed row — cover
          flush left, stretched to the row's full height, content column
          beside it. */}
      <div className="flex">
        <div className="w-24 sm:w-32 shrink-0 bg-[#0a0a0a]">
          {coverImageUrl && (
            // draggable=false so this image never hijacks any ancestor
            // drag-and-drop — <img> is natively draggable by default.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" draggable={false} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex items-start gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-base text-[#ece6d8] font-medium truncate">
              #{String(chapterNumber).padStart(3, "0")} — {chapterName}
            </p>
            <p className="text-sm text-[#b6b0a2] mt-0.5 truncate">
              {arcName ? `${arcName} · ` : ""}
              {publishedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
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
      </div>
    </div>
  );
}
