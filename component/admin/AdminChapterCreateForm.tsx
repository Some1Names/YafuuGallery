"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "./AdminImageUploadButton";
import AdminChapterPdfUploads, { type ChapterTranslationDraft } from "./AdminChapterPdfUploads";
import { MIN_PUBLISHED_DATE, todayLocalISODate } from "@/lib/dates";
import MissingFieldsHint from "@/component/manga/MissingFieldsHint";
import { MAX_CHAPTER_NAME_LENGTH } from "@/lib/content-limits";

interface AdminChapterCreateFormProps {
  mangaId: string;
  arcs: { id: string; arc_name: string }[];
  // Current total chapters on this manga — new chapters always append at
  // the end (chapter_number: totalCount); reordering only ever happens by
  // dragging in the list, not by picking a position here.
  totalCount: number;
  // Controlled from AdminMangaRow so opening this form and editing an
  // existing chapter row mutually close each other — only one
  // chapter-related form is ever open at a time.
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Always scoped to one manga (nested inside its AdminMangaRow), so there's
// no manga picker here — just cover, arc, title, status, date, and the ex
// flag. Collapsed to a single button by default, same open/close pattern
// as AdminArcCreateForm/MangaCreateForm.
export default function AdminChapterCreateForm({ mangaId, arcs, totalCount, isOpen, onOpenChange }: AdminChapterCreateFormProps) {
  const router = useRouter();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [translations, setTranslations] = useState<ChapterTranslationDraft[]>([
    { language: "en", url: null, fileName: null },
  ]);
  const [arcId, setArcId] = useState("");
  const [chapterIsEx, setChapterIsEx] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [publishedDate, setPublishedDate] = useState(todayLocalISODate);
  // latest pickable date — the server allows the same range (parsePublishedDate)
  const [maxDate] = useState(todayLocalISODate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Every field is mandatory for a new chapter — cover and PDF included,
  // even though neither is enforced with a native `required` attribute
  // (they're upload buttons, not plain inputs). Gating the submit button
  // on this is simpler than duplicating the same check server-side, since
  // the fields that DO have `required` already stop a bare Enter-key
  // submit from doing anything either.
  const canSubmit =
    coverImageUrl !== null &&
    translations.some((t) => t.url !== null) &&
    chapterName.trim() !== "" &&
    publishedDate !== "";

  function resetForm() {
    setCoverImageUrl(null);
    setTranslations([{ language: "en", url: null, fileName: null }]);
    setArcId("");
    setChapterIsEx(false);
    setChapterName("");
    setPublishedDate(todayLocalISODate());
    setError(null);
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
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_id: mangaId,
          arc_id: arcId || null,
          chapter_number: totalCount,
          chapter_is_ex: chapterIsEx,
          chapter_name: chapterName,
          published_date: publishedDate,
          cover_image_url: coverImageUrl,
          translations: translations
            .filter((t) => t.url !== null)
            .map((t) => ({ language: t.language, url: t.url, file_name: t.fileName })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create chapter.");
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
        onClick={() => onOpenChange(true)}
        className="self-start px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 transition-colors duration-200"
      >
        + Create Chapter
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border rounded-md p-4 sm:p-8 md:p-12 bg-surface flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <AdminImageUploadButton
          label="Cover"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          boxClassName="w-40 sm:w-54 h-24 sm:h-30 shrink-0"
          aspectRatio={16 / 9}
        />

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-fg-secondary mb-1.5">
                Chapter Title
              </label>
              <div className="flex items-stretch bg-bg border border-border rounded overflow-hidden focus-within:border-fg-secondary transition-colors duration-200">
                <select
                  value={chapterIsEx ? "ex" : "number"}
                  onChange={(e) => setChapterIsEx(e.target.value === "ex")}
                  className="shrink-0 bg-bg border-r border-border pl-3 pr-1.5 text-sm text-fg-secondary focus:outline-none"
                >
                  <option value="number">#{String(totalCount + 1).padStart(3, "0")}</option>
                  <option value="ex">ex</option>
                </select>
                <input
                  value={chapterName}
                  maxLength={MAX_CHAPTER_NAME_LENGTH}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="Chapter title"
                  required
                  className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <label className="block text-xs text-fg-secondary mb-1.5">
                Arc
              </label>
              <select
                value={arcId}
                onChange={(e) => setArcId(e.target.value)}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg"
              >
                <option value="">No arc</option>
                {arcs.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.arc_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-40">
              <label className="block text-xs text-fg-secondary mb-1.5">
                Published Date
              </label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
                min={MIN_PUBLISHED_DATE}
                max={maxDate}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg"
              />
            </div>

            <div className="flex-1">
              <AdminChapterPdfUploads
                mangaId={mangaId}
                value={translations}
                onChange={setTranslations}
                generateCoverIfMissing={!coverImageUrl}
                onCoverGenerated={(url) => setCoverImageUrl((current) => current ?? url)}
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-danger-text">{error}</p>}

      <MissingFieldsHint
        missing={[
          !coverImageUrl && "cover",
          !chapterName.trim() && "title",
          !publishedDate && "date",
          !translations.some((t) => t.url !== null) && "PDF",
        ]}
      />

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
          className="px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? "Creating…" : "+ Create Chapter"}
        </button>
      </div>
    </form>
  );
}
