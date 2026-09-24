"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Wipes the whole reading history (see /api/history), after a confirm —
// it also forgets every saved page and empties Continue Reading.
export default function ClearHistoryButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  async function clearAll() {
    if (!confirm("Clear your whole reading history? Continue Reading and every saved page will be forgotten.")) return;
    setIsPending(true);
    setError(false);
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
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
      {error && <span className="text-xs text-danger">Couldn&apos;t clear — try again.</span>}
      <button
        type="button"
        onClick={clearAll}
        disabled={isPending}
        className="flex items-center gap-1.5 text-sm text-fg-secondary hover:text-danger disabled:opacity-50 transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4" />
        {isPending ? "Clearing…" : "Clear history"}
      </button>
    </div>
  );
}
