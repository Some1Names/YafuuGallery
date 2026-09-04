import Link from "next/link";

interface ContinueReadingCardProps {
  chapterId: string;
  chapterNumber: number;
  chapterName: string;
  coverImageUrl: string | null;
  mangaTitle: string;
}

// Same square-grid visual language as FavoriteChapterCard, but per reading
// history instead of favorites — shows the manga title too since these
// cards can come from any series, not one grouped-by-title section.
export default function ContinueReadingCard({
  chapterId,
  chapterNumber,
  chapterName,
  coverImageUrl,
  mangaTitle,
}: ContinueReadingCardProps) {
  return (
    <Link
      href={`/viewer/${chapterId}`}
      className="group relative block w-full aspect-square rounded-lg overflow-hidden bg-[#ece6d8]"
    >
      <img
        src={coverImageUrl ?? "/placeholder.png"}
        alt={chapterName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#1b1a1c] via-[#1b1a1c]/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-[#ece6d8]/70 text-xs truncate">{mangaTitle}</div>
        <div className="text-[#ece6d8] text-lg font-(family-name:--font-display)">
          #{String(chapterNumber).padStart(3, "0")}
        </div>
        <div className="text-[#ece6d8]/80 text-xs truncate">{chapterName}</div>
      </div>
    </Link>
  );
}
