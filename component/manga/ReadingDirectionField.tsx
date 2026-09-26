"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { READING_DIRECTIONS, type ReadingDirectionValue } from "@/lib/reading-direction";
import { chipClass } from "@/component/manga/chip-class";

// Manga style (right to left) or comic book style (left to right) for the
// manga create/edit forms — which way the reader's page-by-page mode turns
// this manga's pages. A label / field pair for those forms' shared 2-column
// grid, with the same toggle chips as Status.
export default function ReadingDirectionField({
  value,
  onChange,
}: {
  value: ReadingDirectionValue;
  onChange: (next: ReadingDirectionValue) => void;
}) {
  const t = useTranslations("Admin.direction");
  const id = useId();
  return (
    <>
      <span id={`${id}-label`} className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
        {t("label")}
      </span>
      <div className="col-span-2 sm:col-span-1">
        <div role="group" aria-labelledby={`${id}-label`} aria-describedby={`${id}-hint`} className="flex flex-wrap gap-2">
          {READING_DIRECTIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={value === d}
              onClick={() => onChange(d)}
              className={chipClass(value === d)}
            >
              {t(d)}
            </button>
          ))}
        </div>
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-muted">
          {t("hint")}
        </p>
      </div>
    </>
  );
}
