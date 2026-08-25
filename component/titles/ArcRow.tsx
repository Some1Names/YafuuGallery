import Link from "next/link";
import type { ArcItem } from "./types";

export default function ArcRow({ arc }: { arc: ArcItem }) {
  return (
    <Link
      href={`?view=chapters&arc=${arc.id}`}
      className="h-24 sm:h-30 group flex items-center gap-8 cursor-pointer bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200"
    >
      <div className="relative w-40 sm:w-54 h-full overflow-hidden shrink-0 bg-[#ece6d8]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/arcimage.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
      </div>

      <div className="min-w-0 w-full pr-8">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-md sm:text-lg text-[#ece6d8] group-hover:text-[#f2f0f2] transition-colors duration-200">
            {arc.arc_name}
          </span>
          <span className="text-[11px] text-[#b6b0a2] font-mono uppercase">{arc.arc_status}</span>
        </div>
        <div className="text-sm mt-1 text-[#ece6d8]/90 truncate">{arc.chapters.length} chapters</div>
      </div>
    </Link>
  );
}
