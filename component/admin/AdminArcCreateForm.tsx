"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "./AdminImageUploadButton";

interface AdminArcCreateFormProps {
  mangaId: string;
  // Current total arcs on this manga — the position dropdown offers every
  // slot 0..totalCount (appending at the end is the default).
  totalCount: number;
  // Whether some arc already holds the special "ex" slot — when true, the
  // ex checkbox here is disabled (only one ex per manga).
  hasEx: boolean;
  // Controlled from AdminMangaRow so opening this form and editing an
  // existing arc row mutually close each other — only one arc-related
  // form is ever open at a time.
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Always scoped to one manga (nested inside its AdminMangaRow), so there's
// no manga picker here — just cover, name, position, status, and the ex
// flag. Collapsed to a single button by default, same open/close pattern
// as MangaCreateForm.
export default function AdminArcCreateForm({
  mangaId,
  totalCount,
  hasEx,
  isOpen,
  onOpenChange,
}: AdminArcCreateFormProps) {
  const router = useRouter();
  const [arcImageUrl, setArcImageUrl] = useState<string | null>(null);
  const [arcName, setArcName] = useState("");
  const [arcPosition, setArcPosition] = useState(totalCount);
  const [arcIsEx, setArcIsEx] = useState(false);
  const [arcStatus, setArcStatus] = useState<"ongoing" | "completed">("ongoing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setArcImageUrl(null);
    setArcName("");
    setArcPosition(totalCount);
    setArcIsEx(false);
    setArcStatus("ongoing");
    setError(null);
  }

  function handleOpen() {
    // totalCount may have moved on since this form last reset (another
    // arc created elsewhere, page refreshed) — pick up the current value.
    setArcPosition(totalCount);
    onOpenChange(true);
  }

  function handleCancel() {
    resetForm();
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/arcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_id: mangaId,
          arc_name: arcName,
          arc_order: arcPosition,
          arc_is_ex: arcIsEx,
          arc_status: arcStatus,
          arc_image_url: arcImageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create arc.");
        return;
      }

      resetForm();
      onOpenChange(false);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="self-start px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 transition-colors duration-200"
      >
        + Create Arc
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#050505] rounded-md p-12 bg-[#1b1a1c] flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <AdminImageUploadButton
          label="Cover"
          value={arcImageUrl}
          onChange={setArcImageUrl}
          boxClassName="w-40 sm:w-54 h-24 sm:h-30 shrink-0"
        />

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
              Arc Title
            </label>
            <div className="flex items-stretch bg-[#0a0a0a] border border-[#050505] rounded overflow-hidden focus-within:border-[#b6b0a2] transition-colors duration-200">
              <select
                value={arcPosition}
                onChange={(e) => setArcPosition(Number(e.target.value))}
                className="shrink-0 bg-[#0a0a0a] border-r border-[#050505] pl-3 pr-1.5 text-sm text-[#b6b0a2] focus:outline-none"
              >
                {Array.from({ length: totalCount + 1 }, (_, i) => (
                  <option key={i} value={i}>
                    #{String(i + 1).padStart(3, "0")}
                  </option>
                ))}
              </select>
              <input
                value={arcName}
                onChange={(e) => setArcName(e.target.value)}
                placeholder="Arc name"
                required
                className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-40">
              <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
                Status
              </label>
              <select
                value={arcStatus}
                onChange={(e) => setArcStatus(e.target.value as "ongoing" | "completed")}
                className="w-full bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <label
              className={`flex items-center gap-2 text-sm pt-5 ${
                hasEx ? "text-[#6b655e] cursor-not-allowed" : "text-[#ece6d8] cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={arcIsEx}
                disabled={hasEx}
                onChange={(e) => setArcIsEx(e.target.checked)}
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
          onClick={handleCancel}
          className="px-4 py-2 border border-[#050505] rounded-md text-sm text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? "Creating…" : "+ Create Arc"}
        </button>
      </div>
    </form>
  );
}
