import Link from "next/link";
import Image from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { formatChapterBadge } from "@/lib/chapter-number";

interface ContinueReadingCardProps {
  chapterId: string;
  displayNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  coverImageUrl: string | null;
  mangaTitle: string;
  // the reader finished the previous chapter and this is the next one
  isNext?: boolean;
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
  isNext = false,
}: ContinueReadingCardProps) {
  return (
    <Link
      href={`/viewer/${chapterId}`}
      className="group relative block w-full aspect-square rounded-lg overflow-hidden bg-fg"
    >
      {coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt={chapterName}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <NoImagePlaceholder />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/80 via-55% sm:via-40% to-transparent" />

      {/* Fixed colors, not theme tokens — it sits on cover art. */}
      {isNext && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-neutral-900/80 backdrop-blur-sm text-white text-xs font-semibold">
          Up next
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-fg/70 text-xs truncate">{mangaTitle}</div>
        <div className="text-fg text-lg font-(family-name:--font-display)">
          {formatChapterBadge(chapterIsEx, displayNumber)}
        </div>
        <div className="text-fg/80 text-xs truncate">{chapterName}</div>
      </div>
    </Link>
  );
}
