"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { loginHref } from "@/lib/login-redirect";

interface ChapterFavoriteButtonProps {
  chapterId: string;
  initialFavorited: boolean;
}

export default function ChapterFavoriteButton({
  chapterId,
  initialFavorited,
}: ChapterFavoriteButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  async function toggle(e: React.MouseEvent) {
    // Belt-and-braces: callers render this as a sibling of their card/row
    // link, never inside it, but stop the click anyway so nothing behind
    // it navigates.
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
          // signed out — sign in, then come straight back to this page
          router.push(loginHref(window.location.pathname + window.location.search));
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
        // 32x32 hit area around the 16px heart; the negative margin keeps
        // it taking the heart's own space in the row it sits in
        "w-8 h-8 -m-2 flex items-center justify-center transition-colors duration-200 disabled:opacity-50 " +
        (favorited ? "text-red-500" : "text-fg-secondary hover:text-fg")
      }
    >
      <Heart className={"w-4 h-4 " + (favorited ? "fill-current" : "")} />
    </button>
  );
}
