"use client";

import { X, Plus } from "lucide-react";
import { LANGUAGE_OPTIONS, type Language } from "@/lib/language";
import AdminPdfUploadButton from "./AdminPdfUploadButton";

export interface ChapterTranslationDraft {
  language: Language;
  url: string | null;
  fileName: string | null;
}

interface AdminChapterPdfUploadsProps {
  mangaId: string;
  value: ChapterTranslationDraft[];
  onChange: (value: ChapterTranslationDraft[]) => void;
  // Passed straight through to every AdminPdfUploadButton rendered below —
  // see its own prop docs. Which language's PDF ends up supplying the
  // fallback cover is arbitrary (whichever finishes uploading first while
  // the cover is still empty); that's fine, there's no "primary" language.
  generateCoverIfMissing?: boolean;
  onCoverGenerated?: (url: string) => void;
}

// A chapter can hold one Translation per language (chapter_id + language is
// unique) — this renders one AdminPdfUploadButton per language already
// added, each with its own language picker and a remove button, plus an
// "Add another language" control for whichever of th/en/ja isn't in use
// yet. An entry with no file uploaded is just dropped on submit rather
// than treated as an error, so adding a slot and not filling it is harmless.
export default function AdminChapterPdfUploads({
  mangaId,
  value,
  onChange,
  generateCoverIfMissing,
  onCoverGenerated,
}: AdminChapterPdfUploadsProps) {
  const usedLanguages = new Set(value.map((t) => t.language));
  const unusedLanguages = LANGUAGE_OPTIONS.filter((opt) => !usedLanguages.has(opt.value));

  function updateEntry(index: number, patch: Partial<ChapterTranslationDraft>) {
    onChange(value.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function removeEntry(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addEntry() {
    if (unusedLanguages.length === 0) return;
    onChange([...value, { language: unusedLanguages[0].value, url: null, fileName: null }]);
  }

  return (
    <div>
      <label className="block text-xs text-fg-secondary mb-1.5">
        Chapter PDF{value.length > 1 ? "s" : ""}
      </label>

      <div className="flex flex-col gap-2">
        {value.map((t, i) => {
          // Each row's own select offers its current language plus whatever
          // no other row is using — never a language another row already has.
          const rowOptions = LANGUAGE_OPTIONS.filter(
            (opt) => opt.value === t.language || !usedLanguages.has(opt.value)
          );

          // Phones: language + remove on one line, the upload button full
          // width underneath — squeezed between them on one line, its "No
          // PDF uploaded" / file-name label shrank to nothing. sm and up:
          // all three in a row, as before.
          return (
            <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                value={t.language}
                onChange={(e) => updateEntry(i, { language: e.target.value as Language })}
                aria-label="PDF language"
                className="shrink-0 bg-bg border border-border rounded px-2 py-2.5 text-xs text-fg-secondary focus:outline-none focus:border-fg-secondary transition-colors duration-200"
              >
                {rowOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="order-last sm:order-none basis-full sm:basis-auto sm:flex-1 min-w-0">
                <AdminPdfUploadButton
                  mangaId={mangaId}
                  value={t.url}
                  fileName={t.fileName}
                  onChange={(url, fileName) => updateEntry(i, { url, fileName })}
                  generateCoverIfMissing={generateCoverIfMissing}
                  onCoverGenerated={onCoverGenerated}
                />
              </div>

              <button
                type="button"
                onClick={() => removeEntry(i)}
                aria-label={`Remove ${LANGUAGE_OPTIONS.find((opt) => opt.value === t.language)?.label} PDF`}
                className="ml-auto sm:ml-0 shrink-0 self-start p-2.5 border border-border rounded text-fg-muted hover:text-danger hover:border-danger/50 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {unusedLanguages.length > 0 && (
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1.5 mt-2 text-xs text-fg-secondary hover:text-fg transition-colors duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another language
        </button>
      )}
    </div>
  );
}
