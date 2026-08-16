"use client";

import { useState, useTransition } from "react";

interface ChapterFavoriteButtonProps {
  chapterId: string;
  initialFavorited: boolean;
}

export default function ChapterFavoriteButton({
  chapterId,
  initialFavorited,
}: ChapterFavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  async function toggle(e: React.MouseEvent) {
    // stop the click from also triggering the row's own onClick/navigation
    e.preventDefault();
    e.stopPropagation();

    // optimistic update — flip immediately, roll back if the request fails
    const next = !favorited;
    setFavorited(next);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/chapters/${chapterId}/favorite`, {
          method: "POST",
        });

        if (res.status === 401) {
          setFavorited(!next); // roll back
          // TODO: once auth/login page exists, redirect there instead
          alert("Sign in to favorite chapters.");
          return;
        }

        if (!res.ok) {
          setFavorited(!next); // roll back
          return;
        }

        const data = await res.json();
        setFavorited(data.favorited);
      } catch {
        setFavorited(!next); // roll back on network error
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={
        "text-sm font-mono transition-colors duration-200 disabled:opacity-50 " +
        (favorited ? "text-[#9c1d25]" : "text-[#b6b0a2] hover:text-[#ece6d8]")
      }
    >
      {favorited ? "❤" : "❤︎"}
    </button>
  );
}