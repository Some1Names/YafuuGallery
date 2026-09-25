import Link from "next/link";
import Image from "@/component/ShimmerImage"; // next/image + loading shimmer
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
    // The heart is a sibling of the link, positioned over its corner — a
    // button nested inside an <a> is invalid HTML (see MangaCard).
    <div className="group relative">
      <Link
        href={`/viewer/${chapterId}`}
        className="relative block w-full aspect-square rounded-lg overflow-hidden bg-surface"
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

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-fg text-lg font-(family-name:--font-display)">
            {formatChapterBadge(chapterIsEx, displayNumber)}
          </div>
          <div className="text-fg/80 text-xs truncate">{chapterName}</div>
        </div>
      </Link>

      <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-bg/60 backdrop-blur-sm flex items-center justify-center">
        <ChapterFavoriteButton chapterId={chapterId} initialFavorited={true} />
      </div>
    </div>
  );
}
