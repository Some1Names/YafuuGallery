import Link from "next/link";
import { BookOpen } from "lucide-react";
import MangaFavoriteButton from "@/component/titles/MangaFavoriteButton";
import { genreLabel, knownGenres, type MangaStatusValue } from "@/lib/genres";

interface MangaSidebarProps {
  mangaId: string;
  title: string;
  author: string;
  authorId: string;
  synopsis: string;
  status: MangaStatusValue;
  genres: string[];
  isFavorited: boolean;
  // "Start reading" (first chapter) or "Continue #003" (last chapter this
  // reader opened) — null when the manga has no chapters yet.
  readAction: { href: string; label: string } | null;
}

export default function MangaSidebar({
  mangaId,
  title,
  author,
  authorId,
  synopsis,
  status,
  genres,
  isFavorited,
  readAction,
}: MangaSidebarProps) {
  const shownGenres = knownGenres(genres);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl leading-tight wrap-anywhere font-(family-name:--font-display)">{title}</h1>
      {/* opens the author's page — everything else they've published */}
      <Link
        href={`/manga/authors/${authorId}`}
        className="inline-block text-fg-secondary text-base sm:text-lg mt-2 underline-offset-4 hover:text-fg hover:underline transition-colors duration-200"
      >
        {author}
      </Link>

      {/* Status, then genres — each genre opens /search filtered to it. */}
      <ul className="flex flex-wrap items-center gap-2 mt-4" aria-label="Status and genres">
        <li
          className={
            "text-xs font-semibold px-2.5 py-1 rounded-full " +
            (status === "completed" ? "bg-fg text-bg" : "border border-fg/40 text-fg")
          }
        >
          {status === "completed" ? "Completed" : "Ongoing"}
        </li>
        {shownGenres.map((slug) => (
          <li key={slug}>
            <Link
              href={`/search?genre=${slug}`}
              className="block text-xs px-2.5 py-1 rounded-full border border-border text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
            >
              {genreLabel(slug)}
            </Link>
          </li>
        ))}
      </ul>

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
