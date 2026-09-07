"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "./AdminImageUploadButton";

interface AdminArcRowProps {
  id: string;
  name: string;
  isEx: boolean;
  // "How many non-ex arcs come before this one" — only meaningful when
  // !isEx. Independent of `position`, so dragging the ex arc around never
  // changes any regular arc's displayed number.
  displayNumber: number;
  status: "ongoing" | "completed";
  imageUrl: string | null;
  // This arc's current 0-indexed slot within the manga's full arc list —
  // drives the position dropdown below (valid slots are 0..totalCount-1).
  position: number;
  totalCount: number;
  // Whether some OTHER arc already holds the special "ex" slot — when
  // true, the ex checkbox here is disabled (only one ex per manga).
  hasOtherEx: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  // Moves this arc to `newIndex` (0-indexed) within the manga's arc list,
  // shifting every other arc out of the way via the reorder API's
  // transaction. Called before the regular PATCH below whenever the
  // position changed, since a plain PATCH straight to that arc_order
  // would otherwise almost always collide with whichever sibling already
  // sits there.
  onReorder: (newIndex: number) => Promise<boolean>;
}

export default function AdminArcRow({
  id,
  name,
  isEx,
  displayNumber,
  status,
  imageUrl,
  position,
  totalCount,
  hasOtherEx,
  isEditing,
  onToggleEdit,
  onReorder,
}: AdminArcRowProps) {
  const router = useRouter();
  const [editImageUrl, setEditImageUrl] = useState(imageUrl);
  const [editName, setEditName] = useState(name);
  const [editPosition, setEditPosition] = useState(position);
  const [editIsEx, setEditIsEx] = useState(isEx);
  const [editStatus, setEditStatus] = useState<"ongoing" | "completed">(status);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setIsSaving(true);
    setError(null);

    if (editPosition !== position) {
      const reordered = await onReorder(editPosition);
      if (!reordered) {
        setIsSaving(false);
        setError("Failed to reorder — please try again.");
        return;
      }
    }

    const res = await fetch(`/api/admin/arcs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        arc_name: editName,
        arc_order: editPosition,
        arc_is_ex: editIsEx,
        arc_status: editStatus,
        arc_image_url: editImageUrl,
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
    if (
      !confirm(
        `Delete arc "${name}"? Chapters assigned to it will become unassigned, not deleted. This can't be undone.`
      )
    )
      return;
    const res = await fetch(`/api/admin/arcs/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  function cancelEdit() {
    setEditImageUrl(imageUrl);
    setEditName(name);
    setEditPosition(position);
    setEditIsEx(isEx);
    setEditStatus(status);
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
            value={editImageUrl}
            onChange={setEditImageUrl}
            boxClassName="w-40 sm:w-54 h-24 sm:h-30 shrink-0"
          />

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                Arc Title
              </label>
              <div className="flex items-stretch bg-[#0a0a0a] border border-[#050505] rounded overflow-hidden focus-within:border-[#b6b0a2] transition-colors duration-200">
                <select
                  value={editPosition}
                  onChange={(e) => setEditPosition(Number(e.target.value))}
                  className="shrink-0 bg-[#0a0a0a] border-r border-[#050505] pl-3 pr-1.5 text-sm text-[#b6b0a2] focus:outline-none"
                >
                  {Array.from({ length: totalCount }, (_, i) => (
                    <option key={i} value={i}>
                      #{String(i + 1).padStart(3, "0")}
                    </option>
                  ))}
                </select>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-[#ece6d8] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-40">
                <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "ongoing" | "completed")}
                  className="w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <label
                className={`flex items-center gap-2 text-sm pt-5 ${
                  hasOtherEx ? "text-[#6b655e] cursor-not-allowed" : "text-[#ece6d8] cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={editIsEx}
                  disabled={hasOtherEx}
                  onChange={(e) => setEditIsEx(e.target.checked)}
                  className="accent-[#ece6d8]"
                />
                Special (ex) arc
              </label>
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
      {/* Same layout as AdminMangaRow's collapsed row — cover flush left,
          stretched to the row's full height, content column beside it. */}
      <div className="flex">
        <div className="w-24 sm:w-32 shrink-0 bg-[#0a0a0a]">
          {imageUrl && (
            // draggable=false so this image never hijacks the row's own
            // drag-and-drop — <img> is natively draggable by default, and
            // a mousedown starting on it would otherwise trigger the
            // browser's built-in "drag this image" behavior instead of
            // AdminArcList's reorder drag.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" draggable={false} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex items-start gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-base text-[#ece6d8] font-medium truncate">
              {isEx ? "ex" : `#${String(displayNumber).padStart(3, "0")}`} — {name}
            </p>
            <p className="text-sm text-[#b6b0a2] mt-0.5 capitalize truncate">{status}</p>
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
