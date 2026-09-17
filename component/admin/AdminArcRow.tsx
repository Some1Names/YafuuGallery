"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import AdminImageUploadButton from "./AdminImageUploadButton";

interface AdminArcRowProps {
  id: string;
  name: string;
  isEx: boolean;
  // "How many non-ex arcs come before this one" — only meaningful when
  // !isEx. Independent of `arcOrder`, so dragging the ex arc around never
  // changes any regular arc's displayed number.
  displayNumber: number;
  status: "ongoing" | "completed";
  imageUrl: string | null;
  // This arc's current raw arc_order value — sent back unchanged on save
  // (reordering only ever happens by dragging in the list now, not from
  // this form).
  arcOrder: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  // The drag-reorder grip AdminArcList renders for this row. On sm+ it
  // stays outside the card (rendered by the list, to the left), but there's
  // no cover thumbnail to anchor it against below sm, so the list hands it
  // in here to render inline, inside the card's own border.
  dragHandle?: React.ReactNode;
}

export default function AdminArcRow({
  id,
  name,
  isEx,
  displayNumber,
  status,
  imageUrl,
  arcOrder,
  isEditing,
  onToggleEdit,
  dragHandle,
}: AdminArcRowProps) {
  const router = useRouter();
  const [editImageUrl, setEditImageUrl] = useState(imageUrl);
  const [editName, setEditName] = useState(name);
  const [editIsEx, setEditIsEx] = useState(isEx);
  const [editStatus, setEditStatus] = useState<"ongoing" | "completed">(status);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setIsSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/arcs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        arc_name: editName,
        arc_order: arcOrder,
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
    setEditIsEx(isEx);
    setEditStatus(status);
    setError(null);
    onToggleEdit();
  }

  return (
    <div className="border border-[#050505] rounded-md bg-[#1b1a1c] overflow-hidden">
      {/* Cover — hidden on mobile so the row stays a compact text row on
          narrow screens (where a thumbnail this small isn't worth the
          space), shown from sm up. Kept at the edit form's own cover
          ratio (w-54 h-30, i.e. 1.8:1) but scaled down for a collapsed-row
          thumbnail instead of stretching to the row's full height — arc
          covers are wide/short, not the tall manga-poster shape, so
          stretching them crops away most of the art. Stays visible while
          editing — the edit form drops down below it instead of replacing
          it, like a dropdown/accordion panel, so the row never disappears
          from the list mid-edit. */}
      <div className="flex">
        {dragHandle && (
          <div className="flex sm:hidden items-center pl-2 pr-3 text-[#6b655e]">{dragHandle}</div>
        )}

        <div className="relative hidden sm:block sm:w-36 sm:h-20 shrink-0 self-start bg-[#0a0a0a]">
          {imageUrl ? (
            // draggable=false so this image never hijacks the row's own
            // drag-and-drop — <img> is natively draggable by default, and
            // a mousedown starting on it would otherwise trigger the
            // browser's built-in "drag this image" behavior instead of
            // AdminArcList's reorder drag.
            <Image src={imageUrl} alt="" fill draggable={false} sizes="144px" className="object-cover" />
          ) : (
            <NoImagePlaceholder />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-base text-[#ece6d8] font-medium truncate">
              {isEx ? "ex" : `#${String(displayNumber).padStart(3, "0")}`} — {name}
            </p>
            <p className="text-sm text-[#b6b0a2] mt-0.5 capitalize truncate">{status}</p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onToggleEdit}
              className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
            >
              {isEditing ? "Close" : "Edit"}
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

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="border-t border-[#050505] p-12 flex flex-col gap-4"
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
                    value={editIsEx ? "ex" : "number"}
                    onChange={(e) => setEditIsEx(e.target.value === "ex")}
                    className="shrink-0 bg-[#0a0a0a] border-r border-[#050505] pl-3 pr-1.5 text-sm text-[#b6b0a2] focus:outline-none"
                  >
                    <option value="number">#{String(displayNumber).padStart(3, "0")}</option>
                    <option value="ex">ex</option>
                  </select>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-[#ece6d8] focus:outline-none"
                  />
                </div>
              </div>

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
      )}
    </div>
  );
}
