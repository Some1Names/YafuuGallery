"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

interface MangaFavoriteButtonProps {
  mangaId: string;
  initialFavorited: boolean;
  // "button" is the wide labeled button used on the manga detail page;
  // "icon" is a compact heart glyph for use on top of a cover, matching
  // ChapterFavoriteButton's look on FavoriteChapterCard.
  variant?: "button" | "icon";
}

// Same optimistic-toggle pattern as ChapterFavoriteButton — mirrors it
// deliberately for consistency, just pointed at the manga-level route.
export default function MangaFavoriteButton({
  mangaId,
  initialFavorited,
  variant = "button",
}: MangaFavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    // stop the click from also triggering the card's own Link navigation
    e.preventDefault();
    e.stopPropagation();

    const next = !favorited;
    setFavorited(next);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/manga/${mangaId}/favorite`, { method: "POST" });

        if (res.status === 401) {
          setFavorited(!next);
          alert("Sign in to favorite manga.");
          return;
        }
        if (!res.ok) {
          setFavorited(!next);
          return;
        }

        const data = await res.json();
        setFavorited(data.favorited);
      } catch {
        setFavorited(!next);
      }
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={favorited}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        className={
          "text-sm transition-colors duration-200 disabled:opacity-50 " +
          (favorited ? "text-danger" : "text-fg hover:text-danger")
        }
      >
        {favorited ? "❤" : "❤︎"}
      </button>
    );
  }

  // Outline, secondary to the sidebar's solid "Start reading" button. The
  // border is a faded fg rather than --color-border, which is near-black
  // in dark mode and would leave the outline invisible. Favorited state is
  // carried by the filled red heart, not a red block.
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={favorited}
      className="flex items-center justify-center gap-2 h-11 px-4 rounded-md border border-fg/25 text-fg text-sm font-medium hover:border-fg/60 transition-colors duration-200 disabled:opacity-50"
    >
      <Heart
        className={"w-4 h-4 transition-colors duration-200 " + (favorited ? "fill-red-500 text-red-500" : "")}
      />
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
