"use client";

import { useId } from "react";
import { GENRES, MANGA_STATUSES, type GenreSlug, type MangaStatusValue } from "@/lib/genres";
import { useTranslations } from "next-intl";

interface MangaGenreFieldsProps {
  genres: GenreSlug[];
  onGenresChange: (next: GenreSlug[]) => void;
  status: MangaStatusValue;
  onStatusChange: (next: MangaStatusValue) => void;
}

function chipClass(isOn: boolean) {
  return (
    "text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 " +
    (isOn
      ? "border-fg bg-fg text-bg font-medium"
      : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
  );
}

// Status + genre rows for the manga create/edit forms. Renders as label /
// field pairs that drop straight into those forms' shared 2-column grid.
// Plain toggle buttons (aria-pressed) rather than checkboxes styled as
// chips — same pattern as the dashboards' "Reported only" filter.
export default function MangaGenreFields({ genres, onGenresChange, status, onStatusChange }: MangaGenreFieldsProps) {
  const t = useTranslations("Admin");
  const tStatus = useTranslations("Status");
  const tGenres = useTranslations("Genres");
  // the create form and an edit form can be open at the same time
  const id = useId();

  function toggleGenre(slug: GenreSlug) {
    const picked = new Set(genres);
    if (picked.has(slug)) picked.delete(slug);
    else picked.add(slug);
    // kept in the list's own order, same as the server stores it
    onGenresChange(GENRES.map((g) => g.slug).filter((s) => picked.has(s)));
  }

  return (
    <>
      <span id={`${id}-status`} className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
        {t("status")}
      </span>
      <div role="group" aria-labelledby={`${id}-status`} className="col-span-2 sm:col-span-1 flex flex-wrap gap-2">
        {MANGA_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={status === s.value}
            onClick={() => onStatusChange(s.value)}
            className={chipClass(status === s.value)}
          >
            {tStatus(s.value)}
          </button>
        ))}
      </div>

      <span id={`${id}-genres`} className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
        {t("genres")}
      </span>
      <div role="group" aria-labelledby={`${id}-genres`} className="col-span-2 sm:col-span-1 flex flex-wrap gap-2">
        {GENRES.map((g) => {
          const isOn = genres.includes(g.slug);
          return (
            <button
              key={g.slug}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggleGenre(g.slug)}
              className={chipClass(isOn)}
            >
              {tGenres(g.slug)}
            </button>
          );
        })}
      </div>
    </>
  );
}
