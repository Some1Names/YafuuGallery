import Link from "next/link";
import { BookOpen } from "lucide-react";
import MangaFavoriteButton from "@/component/titles/MangaFavoriteButton";

interface MangaSidebarProps {
  mangaId: string;
  title: string;
  author: string;
  synopsis: string;
  isFavorited: boolean;
  // "Start reading" (first chapter) or "Continue #003" (last chapter this
  // reader opened) — null when the manga has no chapters yet.
  readAction: { href: string; label: string } | null;
}

export default function MangaSidebar({ mangaId, title, author, synopsis, isFavorited, readAction }: MangaSidebarProps) {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl leading-tight wrap-anywhere font-(family-name:--font-display)">{title}</h1>
      <p className="text-fg-secondary text-base sm:text-lg mt-2">{author}</p>

      {/* Reading is the primary action — solid ink, full weight. Favorite
          is secondary, so it's an outline beside it rather than a second
          solid block competing for attention. */}
      <div className="flex gap-2 mt-6">
        {readAction ? (
          <Link
            href={readAction.href}
            className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-fg text-bg text-sm font-semibold hover:bg-fg-hover transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" />
            {readAction.label}
          </Link>
        ) : (
          <span className="flex-1 flex items-center justify-center h-11 px-4 rounded-md border border-fg/15 text-fg-muted text-sm">
            No chapters yet
          </span>
        )}
        <MangaFavoriteButton mangaId={mangaId} initialFavorited={isFavorited} />
      </div>

      <p className="mt-8 pt-6 border-t border-border text-base leading-relaxed text-fg/90">{synopsis}</p>
    </div>
  );
}
