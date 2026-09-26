"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { loginHref } from "@/lib/login-redirect";
import { alertRequestFailed } from "@/component/Dialog";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Favorite");
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    // Belt-and-braces: MangaCard renders this as a sibling of its link,
    // never inside it, but stop the click anyway so nothing behind it
    // navigates.
    e.preventDefault();
    e.stopPropagation();

    const next = !favorited;
    setFavorited(next);
    const failedTitle = next ? t("addFailed") : t("removeFailed");

    startTransition(async () => {
      // the dialogs aren't awaited, so the heart isn't left disabled while one is open
      try {
        const res = await fetch(`/api/manga/${mangaId}/favorite`, { method: "POST" });

        if (res.status === 401) {
          setFavorited(!next);
          // signed out — sign in, then come straight back to this page
          router.push(loginHref(window.location.pathname + window.location.search));
          return;
        }
        if (!res.ok) {
          setFavorited(!next);
          void alertRequestFailed(failedTitle, res);
          return;
        }

        const data = await res.json();
        setFavorited(data.favorited);
      } catch {
        setFavorited(!next);
        void alertRequestFailed(failedTitle, null);
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
        aria-label={favorited ? t("remove") : t("add")}
        // fills the round backdrop it sits in (MangaCard), so the whole
        // 32px circle is the tap target — not just the 16px heart
        className={
          "w-full h-full rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50 " +
          (favorited ? "text-red-500" : "text-fg hover:text-red-500")
        }
      >
        <Heart className={"w-4 h-4 " + (favorited ? "fill-current" : "")} />
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
      {favorited ? t("favorited") : t("favorite")}
    </button>
  );
}
