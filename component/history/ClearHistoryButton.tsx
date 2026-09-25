"use client";

import { useState } from "react";
import { alertRequestFailed, confirmDialog } from "@/component/Dialog";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Wipes the whole reading history (see /api/history), after a confirm —
// it also forgets every saved page and empties Continue Reading.
export default function ClearHistoryButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function clearAll() {
    const confirmed = await confirmDialog({
      title: "Clear reading history?",
      message: "Continue Reading and every saved page will be forgotten.",
      confirmLabel: "Clear history",
      tone: "danger",
    });
    if (!confirmed) return;
    setIsPending(true);
    const res = await fetch("/api/history", { method: "DELETE" }).catch(() => null);
    setIsPending(false);
    if (!res?.ok) return alertRequestFailed("Couldn't clear history", res);
    router.refresh();
  }

  return (
    // py-2.5/-my-2.5: a 40px-tall tap area without taking more room
    <button
      type="button"
      onClick={clearAll}
      disabled={isPending}
      className="flex items-center gap-1.5 py-2.5 -my-2.5 text-sm text-fg-secondary hover:text-danger-text disabled:opacity-50 transition-colors duration-200"
    >
      <Trash2 className="w-4 h-4" />
      {isPending ? "Clearing…" : "Clear history"}
    </button>
  );
}
