import Link from "next/link";
import ChapterFavoriteButton from "./ChapterFavoriteButton";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";

interface FavoriteChapterCardProps {
  chapterId: string;
  displayNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  coverImageUrl: string | null;
}

// Square-grid counterpart to ChapterRow/FavoriteChapterRow — same
// cover-with-caption language as MangaCard, just squared off instead of
// portrait, since these sit in a grid grouped by manga rather than a list.
export default function FavoriteChapterCard({
  chapterId,
  displayNumber,
  chapterIsEx,
  chapterName,
  coverImageUrl,
}: FavoriteChapterCardProps) {
  return (
    <div className="group relative flex flex-col gap-2">
      <Link
        href={`/viewer/${chapterId}`}
        className="relative block w-full aspect-square rounded-lg overflow-hidden bg-[#ece6d8]"
      >
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={chapterName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#1b1a1c] via-[#1b1a1c]/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-[#ece6d8] text-lg font-(family-name:--font-display)">
            {formatChapterBadge(chapterIsEx, displayNumber)}
          </div>
          <div className="text-[#ece6d8]/80 text-xs truncate">{chapterName}</div>
        </div>

        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#0a0a0a]/60 backdrop-blur-sm flex items-center justify-center">
          <ChapterFavoriteButton chapterId={chapterId} initialFavorited={true} />
        </div>
      </Link>
    </div>
  );
}
