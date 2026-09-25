"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "@/component/admin/AdminImageUploadButton";
import MangaGenreFields from "@/component/manga/MangaGenreFields";
import type { GenreSlug, MangaStatusValue } from "@/lib/genres";

// Shared by /admin and /manage — creating a manga always attributes it to
// the signed-in account. There's no "choose an author" picker: a manga's
// author is whoever created it, not a separately assignable field, so the
// server infers author_id from the session regardless of role.
export default function MangaCreateForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [genres, setGenres] = useState<GenreSlug[]>([]);
  const [status, setStatus] = useState<MangaStatusValue>("ongoing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cover/banner aren't enforced with a native `required` attribute
  // (they're upload buttons, not plain inputs), so gate the submit button
  // on them directly — same pattern as AdminChapterCreateForm.
  const canSubmit =
    coverImageUrl !== null && bannerImageUrl !== null && title.trim() !== "" && synopsis.trim() !== "";

  function resetForm() {
    setTitle("");
    setSynopsis("");
    setCoverImageUrl(null);
    setBannerImageUrl(null);
    setGenres([]);
    setStatus("ongoing");
    setError(null);
  }

  function handleCancel() {
    resetForm();
    setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/manga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_title: title,
          manga_synopsis: synopsis,
          cover_image_url: coverImageUrl,
          banner_image_url: bannerImageUrl,
          genres,
          manga_status: status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create manga.");
        return;
      }

      resetForm();
      setIsOpen(false);
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
        onClick={() => setIsOpen(true)}
        className="mb-6 px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 transition-colors duration-200"
      >
        + Create Manga
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-md p-4 sm:p-8 md:p-12 bg-surface flex flex-col gap-4 mb-6">
      <h3 className="text-lg text-fg font-(family-name:--font-display)">Add New Manga Title</h3>

      {/* One shared grid for the whole body instead of two separate grids
          with matching-by-hand column templates/gaps — change gap-x/the
          column ratio once here and every row (images + label/field rows)
          follows automatically, nothing to keep back in sync manually.

          Column widths are 3:16 — exactly the ratio where each box's own
          aspect ratio (2:3 for cover, 32:9 for banner) derives the SAME
          height from its own column width, so cover/banner land on a
          shared height as a side effect while still summing to the full
          row width. Label/field rows reuse that same column split; on
          mobile each label and its field col-span the full row (stacked)
          since there's only one column there anyway. */}
      <div className="grid grid-cols-2 sm:grid-cols-[3fr_16fr] gap-x-7 gap-y-4">
        <AdminImageUploadButton
          label="Cover"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          boxClassName="w-full aspect-2/3"
          aspectRatio={2 / 3}
        />
        <AdminImageUploadButton
          label="Banner"
          // phones: full width, above the cover — sharing a 2-column row
          // with the cover left the 32:9 banner a ~140x40px sliver
          className="order-first col-span-2 sm:order-none sm:col-span-1"
          value={bannerImageUrl}
          onChange={setBannerImageUrl}
          boxClassName="w-full aspect-32/9"
          aspectRatio={32 / 9}
        />

        <label className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
          Manga Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Manga title"
          required
          className="col-span-2 sm:col-span-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />

        <label className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
          Synopsis
        </label>
        <textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="Synopsis"
          required
          rows={3}
          className="col-span-2 sm:col-span-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg placeholder:text-fg-muted resize-none"
        />

        <MangaGenreFields genres={genres} onGenresChange={setGenres} status={status} onStatusChange={setStatus} />
      </div>

      {error && <p className="text-sm text-danger-text">{error}</p>}

      <div className="flex gap-2 self-end">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          title={!canSubmit ? "Cover, banner, title, and synopsis are all required" : undefined}
          className="px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? "Creating…" : "+ Create Manga"}
        </button>
      </div>
    </form>
  );
}
