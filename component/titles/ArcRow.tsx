import Image from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import type { ArcItem } from "./types";

interface ArcRowProps {
  arc: ArcItem;
  onSelect: (arcId: string) => void;
}

export default function ArcRow({ arc, onSelect }: ArcRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(arc.id)}
      className="h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer text-left bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover transition-colors duration-200"
    >
      {/* Mobile: width is driven by an aspect ratio off the row's own
          height instead of a fixed w-24 — that used to crop the 16:9 arc
          image into a near-square box. 3:2 to match ChapterRow, so the two
          lists line up when switching between the Chapters/Arcs tabs.
          Desktop keeps its fixed-width column (sm:aspect-auto). */}
      <div className="relative aspect-3/2 sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-surface">
        {arc.arc_image_url ? (
          <>
            <Image
              src={arc.arc_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 142px, 216px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-surface/20 to-surface" />
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 w-full pr-3 sm:pr-8">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-md sm:text-lg text-fg group-hover:text-fg-hover transition-colors duration-200 truncate">
            {arc.arc_name}
          </span>
          <span className="text-[11px] text-fg-secondary uppercase shrink-0">{arc.arc_status}</span>
        </div>
        <div className="text-sm mt-1 text-fg/90 truncate">{arc.chapters.length} chapters</div>
      </div>
    </button>
  );
}
