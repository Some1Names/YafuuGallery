"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import ChapterList from "./ChapterList";
import ArcList from "./ArcList";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";
import type { ArcItem, ChapterItem } from "./types";
import { useTranslations } from "next-intl";

interface ChapterArcSectionProps {
  arcs: ArcItem[];
  looseChapters: ChapterItem[];
  favoritedChapterIds: string[];
  // chapters differ in which languages they're in — rows show their codes
  showChapterLanguages?: boolean;
}

// Chapters/Arcs toggle, chapter-count + sort, and the list itself, all in
// one client component driven by local state instead of URL searchParams —
// every arc/chapter is already fetched up front, so switching view/sort/arc
// doesn't need a server round trip and shouldn't reload the page to do it.
export default function ChapterArcSection({
  arcs,
  looseChapters,
  favoritedChapterIds,
  showChapterLanguages = false,
}: ChapterArcSectionProps) {
  const t = useTranslations("Manga");
  const [activeView, setActiveView] = useState<"chapters" | "arcs">("chapters");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredArcId, setFilteredArcId] = useState<string | null>(null);

  const filteredArc = filteredArcId ? (arcs.find((a) => a.id === filteredArcId) ?? null) : null;

  // Display numbers are computed from every chapter on the manga, not just
  // the currently filtered arc's — otherwise filtering to one arc would
  // renumber its chapters relative to the manga as a whole.
  const displayNumbers = useMemo(
    () => getChapterDisplayNumbers([...arcs.flatMap((arc) => arc.chapters), ...looseChapters]),
    [arcs, looseChapters]
  );

  const chapters = useMemo(() => {
    const base = filteredArc
      ? filteredArc.chapters
      : [...arcs.flatMap((arc) => arc.chapters), ...looseChapters];

    return [...base].sort((a, b) =>
      sortOrder === "asc" ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
    );
  }, [arcs, looseChapters, filteredArc, sortOrder]);

  // The tab's count is the whole manga's, not the (possibly arc-filtered)
  // list below it — that list shows its own arc filter chip instead.
  const allChapterCount = arcs.reduce((n, arc) => n + arc.chapters.length, 0) + looseChapters.length;

  function selectArc(arcId: string) {
    setFilteredArcId(arcId);
    setActiveView("chapters");
  }

  const tabs = [
    { id: "chapters" as const, label: t("chapters"), count: allChapterCount },
    { id: "arcs" as const, label: t("arcs"), count: arcs.length },
  ];

  return (
    <>
      {/* Tab row: same size for both tabs (the old version resized the
          text on switch, which made the row jump), the active one marked by
          the same 2px ink bar the navbar uses, sitting on the row's own
          bottom rule. */}
      <div className="flex items-end justify-between gap-4 mb-5 border-b border-fg/10">
        {/* Plain toggle buttons (aria-pressed), not role="tab" — the tab
            pattern promises arrow-key navigation this doesn't implement. */}
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveView(tab.id)}
                className={
                  "relative pb-3 text-lg sm:text-xl transition-colors duration-200 font-(family-name:--font-display) " +
                  (isActive ? "text-fg" : "text-fg-muted hover:text-fg-secondary")
                }
              >
                {tab.label}
                <span className="ml-2 align-middle text-xs font-(family-name:--font-body) font-medium">{tab.count}</span>
                {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-fg" />}
              </button>
            );
          })}
        </div>

        {activeView === "chapters" && (
          <button
            type="button"
            onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
            aria-label={sortOrder === "asc" ? t("oldestFirst") : t("newestFirst")}
            className="flex items-center gap-1.5 pb-3 text-xs text-fg-secondary hover:text-fg whitespace-nowrap transition-colors duration-200"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            {/* just "Oldest"/"Newest" on phones — the full label wrapped
                onto two lines beside the tabs at 320px */}
            <span className="sm:hidden">{sortOrder === "asc" ? t("oldest") : t("newest")}</span>
            <span className="hidden sm:inline">{sortOrder === "asc" ? t("oldestFirst") : t("newestFirst")}</span>
          </button>
        )}
      </div>

      {activeView === "chapters" && filteredArc && (
        <button
          type="button"
          onClick={() => setFilteredArcId(null)}
          className="inline-flex items-center gap-2 text-xs text-fg-secondary hover:text-fg mb-4 transition-colors duration-200"
        >
          ← {t("allChapters")}
          <span className="text-fg">({filteredArc.arc_name})</span>
        </button>
      )}

      {activeView === "chapters" ? (
        chapters.length === 0 && filteredArc ? (
          <p className="text-sm text-fg-secondary">{t("noChaptersInArc")}</p>
        ) : (
          <ChapterList
            chapters={chapters}
            favoritedChapterIds={favoritedChapterIds}
            displayNumbers={displayNumbers}
            showLanguages={showChapterLanguages}
          />
        )
      ) : (
        <ArcList arcs={arcs} onSelectArc={selectArc} />
      )}
    </>
  );
}
