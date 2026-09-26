"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { loginHref } from "@/lib/login-redirect";
import { alertRequestFailed } from "@/component/Dialog";
import { useTranslations } from "next-intl";

interface ChapterFavoriteButtonProps {
  chapterId: string;
  initialFavorited: boolean;
}

export default function ChapterFavoriteButton({
  chapterId,
  initialFavorited,
}: ChapterFavoriteButtonProps) {
  const t = useTranslations("Favorite");
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
    const failedTitle = next ? t("addFailed") : t("removeFailed");

    startTransition(async () => {
      // the dialogs aren't awaited, so the heart isn't left disabled while one is open
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
          void alertRequestFailed(failedTitle, res);
          return;
        }

        const data = await res.json();
        setFavorited(data.favorited);
      } catch {
        setFavorited(!next); // roll back on network error
        void alertRequestFailed(failedTitle, null);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={favorited ? t("remove") : t("add")}
      className={
        // 40x40 hit area around the 16px heart; the negative margin keeps
        // it taking the heart's own space in the row it sits in
        "w-10 h-10 -m-3 flex items-center justify-center transition-colors duration-200 disabled:opacity-50 " +
        (favorited ? "text-red-500" : "text-fg-secondary hover:text-fg")
      }
    >
      <Heart className={"w-4 h-4 " + (favorited ? "fill-current" : "")} />
    </button>
  );
}
