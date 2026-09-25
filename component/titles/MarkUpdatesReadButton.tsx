"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

// Favorites → Updates: clears every "New" label at once without opening
// each chapter (see /api/favorites/updates/seen). router.refresh() also
// re-renders the navbar, so its Favorites dot goes away too.
export default function MarkUpdatesReadButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  async function markRead() {
    setIsPending(true);
    setError(false);
    try {
      const res = await fetch("/api/favorites/updates/seen", { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-xs text-danger">Couldn&apos;t update — try again.</span>}
      <button
        type="button"
        onClick={markRead}
        disabled={isPending}
        className="shrink-0 whitespace-nowrap flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
      >
        <CheckCheck className="w-4 h-4" />
        {isPending ? "Marking…" : "Mark all as read"}
      </button>
    </div>
  );
}
