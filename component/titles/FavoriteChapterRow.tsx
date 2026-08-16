import Link from "next/link";
import ChapterFavoriteButton from "./ChapterFavoriteButton";

interface FavoriteChapterRowProps {
  chapterId: string;
  chapterNumber: number;
  chapterName: string;
  mangaId: string;
  mangaTitle: string;
}

// Same visual pattern as ChapterRow, but shows which manga each chapter
// belongs to — needed here since favorites can span multiple series,
// unlike ChapterRow which always sits inside one manga's detail page.
export default function FavoriteChapterRow({
  chapterId,
  chapterNumber,
  chapterName,
  mangaId,
  mangaTitle,
}: FavoriteChapterRowProps) {
  return (
    <div className="h-20 group flex items-center gap-8 bg-[#1b1a1c]/95 hover:bg-[#232224] border border-[#050505] hover:border-[#f6f1f2] transition-colors duration-200">
      <Link
        href={`/manga/titles/${mangaId}/chapter/${chapterId}`}
        className="relative w-36 h-full overflow-hidden shrink-0 bg-[#ece6d8]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1b1a1c]/20 to-[#1b1a1c]" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/manga/titles/${mangaId}`}
            className="text-xs text-[#b6b0a2] hover:text-[#ece6d8] font-mono truncate transition-colors duration-200"
          >
            {mangaTitle}
          </Link>
          <ChapterFavoriteButton chapterId={chapterId} initialFavorited={true} />
        </div>
        <Link href={`/manga/titles/${mangaId}/chapter/${chapterId}`} className="block">
          <span className="text-base text-[#ece6d8] group-hover:text-[#f2f0f0] transition-colors duration-200 font-(family-name:--font-display)">
            #{String(chapterNumber).padStart(3, "0")}
          </span>
          <span className="text-sm text-[#ece6d8]/90 truncate ml-2">{chapterName}</span>
        </Link>
      </div>
    </div>
  );
}
