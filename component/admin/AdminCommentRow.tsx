"use client";

import { useState, useTransition } from "react";

interface AdminCommentRowProps {
  commentId: string;
  body: string;
  userName: string;
  chapterLabel: string;
  createdAt: Date;
  initialHidden: boolean;
}

export default function AdminCommentRow({
  commentId,
  body,
  userName,
  chapterLabel,
  createdAt,
  initialHidden,
}: AdminCommentRowProps) {
  const [hidden, setHidden] = useState(initialHidden);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const previous = hidden;
    setHidden(!hidden); // optimistic

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

  return (
    <div
      className={`border border-[#050505] rounded-md p-3 flex items-start justify-between gap-4 ${
        hidden ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="text-xs text-[#b6b0a2] font-mono mb-1">
          {userName} · {chapterLabel} ·{" "}
          {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {hidden && <span className="text-[#9c1d25]"> · hidden</span>}
        </div>
        <p className="text-sm text-[#ece6d8]">{body}</p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className="shrink-0 text-xs font-mono px-3 py-1.5 border border-[#050505] rounded hover:border-[#b6b0a2] text-[#b6b0a2] hover:text-[#ece6d8] disabled:opacity-50 transition-colors duration-200"
      >
        {hidden ? "Unhide" : "Hide"}
      </button>
    </div>
  );
}
