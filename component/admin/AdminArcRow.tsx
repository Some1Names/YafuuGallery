"use client";

import { useState } from "react";
import { alertRequestFailed, confirmDialog } from "@/component/Dialog";
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
    const confirmed = await confirmDialog({
      title: `Delete arc "${name}"?`,
      message: "Chapters in it become unassigned, not deleted. This can't be undone.",
      confirmLabel: "Delete arc",
      tone: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/admin/arcs/${id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) return alertRequestFailed("Couldn't delete arc", res);
    router.refresh();
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
    <div className="border border-border rounded-md bg-surface overflow-hidden">
      {/* Cover — hidden on mobile so the row stays a compact text row on
          narrow screens (where a thumbnail this small isn't worth the
          space), shown from sm up. sm:grid (not flex) — same reasoning as
          ProfileEditForm's avatar column: CSS grid resolves aspect-ratio
          correctly against a sibling-driven stretched height, so the cover
          keeps its 16:9 shape (matching the edit form's own crop ratio)
          while its height — and, from that, its width — tracks however
          tall the row ends up, instead of either leaving a gap or getting
          stretched out of ratio. Stays visible while editing — the edit
          form drops down below it instead of replacing it, like a
          dropdown/accordion panel, so the row never disappears from the
          list mid-edit. min-h matches AdminChapterRow's own natural
          height (title + subtitle + favorite/comment line) so arc and
          chapter rows read as the same size in the admin panel even
          though an arc row only has two lines of text. Two values, not
          one — below sm the text/button columns stack (flex-col) instead
          of sitting side by side, which is taller than sm+'s layout, so
          the two breakpoints need their own floor to actually match. */}
      <div className="flex sm:grid sm:grid-cols-[auto_1fr] min-h-34 sm:min-h-25">
        {dragHandle && (
          <div className="flex sm:hidden items-center pl-2 pr-3 text-fg-muted">{dragHandle}</div>
        )}

        <div className="relative hidden sm:block sm:h-full sm:w-auto sm:aspect-video bg-bg">
          {imageUrl ? (
            // draggable=false so this image never hijacks the row's own
            // drag-and-drop — <img> is natively draggable by default, and
            // a mousedown starting on it would otherwise trigger the
            // browser's built-in "drag this image" behavior instead of
            // AdminArcList's reorder drag.
            <Image src={imageUrl} alt="" fill draggable={false} sizes="180px" className="object-cover" />
          ) : (
            <NoImagePlaceholder />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-base text-fg font-medium truncate">
              {isEx ? "ex" : `#${String(displayNumber).padStart(3, "0")}`} — {name}
            </p>
            <p className="text-sm text-fg-secondary mt-0.5 capitalize truncate">{status}</p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onToggleEdit}
              className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
            >
              {isEditing ? "Close" : "Edit"}
            </button>
            <button
              onClick={remove}
              className="text-xs px-3 py-1.5 border border-danger-text/50 rounded text-danger-text hover:bg-danger/10 transition-colors duration-200"
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
          className="border-t border-border p-4 sm:p-8 md:p-12 flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <AdminImageUploadButton
              label="Cover"
              value={editImageUrl}
              onChange={setEditImageUrl}
              boxClassName="w-40 sm:w-54 h-24 sm:h-30 shrink-0"
              aspectRatio={16 / 9}
            />

            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-xs text-fg-secondary mb-1.5">
                  Arc Title
                </label>
                <div className="flex items-stretch bg-bg border border-border rounded overflow-hidden focus-within:border-fg-secondary transition-colors duration-200">
                  <select
                    value={editIsEx ? "ex" : "number"}
                    onChange={(e) => setEditIsEx(e.target.value === "ex")}
                    className="shrink-0 bg-bg border-r border-border pl-3 pr-1.5 text-sm text-fg-secondary focus:outline-none"
                  >
                    <option value="number">#{String(displayNumber).padStart(3, "0")}</option>
                    <option value="ex">ex</option>
                  </select>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-fg focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:w-40">
                <label className="block text-xs text-fg-secondary mb-1.5">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "ongoing" | "completed")}
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-danger-text">{error}</p>}

          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
