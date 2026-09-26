import Image from "@/component/ShimmerImage"; // next/image + loading shimmer
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import type { ArcItem } from "./types";
import { useTranslations } from "next-intl";

interface ArcRowProps {
  arc: ArcItem;
  onSelect: (arcId: string) => void;
}

export default function ArcRow({ arc, onSelect }: ArcRowProps) {
  const t = useTranslations("Manga");
  return (
    <button
      type="button"
      onClick={() => onSelect(arc.id)}
      className="h-24 sm:h-30 group flex items-center gap-3 sm:gap-8 cursor-pointer text-left bg-surface/95 hover:bg-surface-hover border border-border hover:border-fg-hover transition-colors duration-200"
    >
      {/* Mobile: width is driven by an aspect ratio off the row's own
          height — same ratios as ChapterRow, so the two lists line up when
          switching between the Chapters/Arcs tabs. Desktop keeps its
          fixed-width column (sm:aspect-auto). */}
      <div className="relative aspect-square min-[360px]:aspect-4/3 sm:aspect-auto w-auto sm:w-54 h-full overflow-hidden shrink-0 bg-surface">
        {arc.arc_image_url ? (
          <>
            <Image
              src={arc.arc_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 128px, 216px"
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
          <span className="min-w-0 line-clamp-2 sm:line-clamp-1 wrap-break-word text-md sm:text-lg text-fg group-hover:text-fg-hover transition-colors duration-200">
            {arc.arc_name}
          </span>
          <span className="text-xs text-fg-secondary uppercase shrink-0">{arc.arc_status}</span>
        </div>
        <div className="text-sm mt-1 text-fg/90 truncate">
          {t("chapterCount", { count: arc.chapters.length })}
        </div>
      </div>
    </button>
  );
}
