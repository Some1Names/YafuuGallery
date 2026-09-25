"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { SORTS, searchHref, type SearchFilters } from "@/lib/search-filters";

// /search's sort picker: a button showing the current order, opening a
// small menu of links (same look as the navbar's dropdowns). Each option is
// still a plain link to the sorted URL, like the rest of the filter bar.
// A disclosure (button + list of links), not an ARIA menu — closes on an
// outside click, Escape (focus back to the button) or picking an option.
export default function SortDropdown({ filters }: { filters: SearchFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = SORTS.find((s) => s.value === filters.sort) ?? SORTS[0];

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={
          "flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-full border text-sm transition-colors duration-200 " +
          (isOpen
            ? "border-fg-secondary bg-surface text-fg"
            : "border-border bg-surface text-fg-secondary hover:text-fg hover:border-fg-secondary")
        }
      >
        <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
        <span>
          <span className="sr-only">Sort by: </span>
          <span className="sm:hidden">{current.short}</span>
          <span className="hidden sm:inline">{current.label}</span>
        </span>
        <ChevronDown
          className={"w-3.5 h-3.5 transition-transform duration-200 " + (isOpen ? "rotate-180" : "")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        // Left-aligned on phones, where the button wraps onto its own line
        // at the left edge (right-aligned, the menu would run off-screen);
        // right-aligned from sm up, where the button sits at the right.
        <ul className="absolute right-0 top-full mt-2 z-20 w-48 py-1.5 bg-surface border border-border rounded-md shadow-lg">
          {SORTS.map((s) => {
            const isOn = s.value === filters.sort;
            return (
              <li key={s.value}>
                <Link
                  href={searchHref({ ...filters, sort: s.value })}
                  scroll={false}
                  onClick={() => setIsOpen(false)}
                  aria-current={isOn ? "true" : undefined}
                  className={
                    "flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors duration-200 " +
                    (isOn ? "text-fg font-medium" : "text-fg-secondary hover:text-fg")
                  }
                >
                  {s.label}
                  {isOn && <Check className="w-4 h-4" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
