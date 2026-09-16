import Link from "next/link";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";

interface ContinueReadingCardProps {
  chapterId: string;
  displayNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  coverImageUrl: string | null;
  mangaTitle: string;
}

// Same square-grid visual language as FavoriteChapterCard, but per reading
// history instead of favorites — shows the manga title too since these
// cards can come from any series, not one grouped-by-title section.
export default function ContinueReadingCard({
  chapterId,
  displayNumber,
  chapterIsEx,
  chapterName,
  coverImageUrl,
  mangaTitle,
}: ContinueReadingCardProps) {
  return (
    <Link
      href={`/viewer/${chapterId}`}
      className="group relative block w-full aspect-square rounded-lg overflow-hidden bg-[#ece6d8]"
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
        <div className="text-[#ece6d8]/70 text-xs truncate">{mangaTitle}</div>
        <div className="text-[#ece6d8] text-lg font-(family-name:--font-display)">
          {formatChapterBadge(chapterIsEx, displayNumber)}
        </div>
        <div className="text-[#ece6d8]/80 text-xs truncate">{chapterName}</div>
      </div>
    </Link>
  );
}
