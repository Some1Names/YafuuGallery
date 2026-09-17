"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatUsername } from "@/lib/format-username";

interface AdminCommentRowProps {
  commentId: string;
  body: string;
  userName: string;
  userTag: string | null;
  chapterLabel: string;
  createdAt: Date;
  initialHidden: boolean;
}

export default function AdminCommentRow({
  commentId,
  body,
  userName,
  userTag,
  chapterLabel,
  createdAt,
  initialHidden,
}: AdminCommentRowProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(initialHidden);
  const [isPending, startTransition] = useTransition();

  function toggleHide() {
    const previous = hidden;
    setHidden(!hidden);

    startTransition(async () => {
      const res = await fetch(`/api/admin/comments/${commentId}/hide`, { method: "POST" });
      if (!res.ok) {
        setHidden(previous);
        return;
      }
      const data = await res.json();
      setHidden(data.hidden);
    });
  }

  async function remove() {
    if (!confirm("Permanently delete this comment? This can't be undone.")) return;
    const res = await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div
      className={`border border-[#050505] rounded-md p-3 flex items-start justify-between gap-4 ${
        hidden ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="text-xs text-[#b6b0a2] mb-1">
          {formatUsername(userName, userTag)} · {chapterLabel} ·{" "}
          {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {hidden && <span className="text-[#9c1d25]"> · hidden</span>}
        </div>
        <p className="text-sm text-[#ece6d8]">{body}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleHide}
          disabled={isPending}
          className="text-xs px-3 py-1.5 border border-[#050505] rounded hover:border-[#b6b0a2] text-[#b6b0a2] hover:text-[#ece6d8] disabled:opacity-50 transition-colors duration-200"
        >
          {hidden ? "Unhide" : "Hide"}
        </button>
        <button
          type="button"
          onClick={remove}
          className="text-xs px-3 py-1.5 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}