"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { alertRequestFailed } from "@/component/Dialog";
import { useTranslations } from "next-intl";

// The × on a /history row. No confirm — it's one entry, and reading the
// chapter again brings it straight back.
export default function RemoveFromHistoryButton({ chapterId, label }: { chapterId: string; label: string }) {
  const t = useTranslations("History");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function remove() {
    setIsPending(true);
    try {
      const res = await fetch(`/api/chapters/${chapterId}/progress`, { method: "DELETE" }).catch(() => null);
      if (!res?.ok) return await alertRequestFailed(t("removeFailed"), res);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={isPending}
      aria-label={t("remove", { label })}
      title={t("removeShort")}
      className="w-10 h-10 flex items-center justify-center rounded-full text-fg-muted hover:text-fg hover:bg-surface-hover disabled:opacity-50 transition-colors duration-200"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
