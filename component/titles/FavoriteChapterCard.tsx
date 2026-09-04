import Link from "next/link";
import ChapterFavoriteButton from "./ChapterFavoriteButton";

interface FavoriteChapterCardProps {
  chapterId: string;
  chapterNumber: number;
  chapterName: string;
  coverImageUrl: string | null;
}

// Square-grid counterpart to ChapterRow/FavoriteChapterRow — same
// cover-with-caption language as MangaCard, just squared off instead of
// portrait, since these sit in a grid grouped by manga rather than a list.
export default function FavoriteChapterCard({
  chapterId,
  chapterNumber,
  chapterName,
  coverImageUrl,
}: FavoriteChapterCardProps) {
  return (
    <div className="group relative flex flex-col gap-2">
      <Link
        href={`/viewer/${chapterId}`}
        className="relative block w-full aspect-square rounded-lg overflow-hidden bg-[#ece6d8]"
      >
        <img
          src={coverImageUrl ?? "/placeholder.png"}
          alt={chapterName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1b1a1c] via-[#1b1a1c]/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-[#ece6d8] text-lg font-(family-name:--font-display)">
            #{String(chapterNumber).padStart(3, "0")}
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
