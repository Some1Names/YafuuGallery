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
  // How many readers have reported this comment (0 = none).
  reportCount: number;
  // Authors (on /manage) can hide/unhide comments on their own manga but
  // not permanently delete them — the delete route is admin-only.
  canDelete?: boolean;
}

export default function AdminCommentRow({
  commentId,
  body,
  userName,
  userTag,
  chapterLabel,
  createdAt,
  initialHidden,
  reportCount,
  canDelete = true,
}: AdminCommentRowProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(initialHidden);
  const [isPending, startTransition] = useTransition();

  // Dismissing clears the reports (the comment stays up) — refresh so the
  // dashboard's "Reported" filter/count update too.
  async function dismissReports() {
    const res = await fetch(`/api/admin/comments/${commentId}/reports`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

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
    if (!confirm("Permanently delete this comment and any replies to it? This can't be undone.")) return;
    const res = await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div
      className={`border border-border rounded-md p-3 flex items-start justify-between gap-4 ${
        hidden ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="text-xs text-fg-secondary mb-1">
          {formatUsername(userName, userTag)} · {chapterLabel} ·{" "}
          {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {hidden && <span className="text-danger"> · hidden</span>}
          {reportCount > 0 && (
            <span className="text-danger">
              {" "}
              · reported {reportCount === 1 ? "once" : `${reportCount} times`}
            </span>
          )}
        </div>
        <p className="text-sm text-fg">{body}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {reportCount > 0 && (
          <button
            type="button"
            onClick={dismissReports}
            className="text-xs px-3 py-1.5 border border-border rounded hover:border-fg-secondary text-fg-secondary hover:text-fg transition-colors duration-200"
          >
            Dismiss reports
          </button>
        )}
        <button
          type="button"
          onClick={toggleHide}
          disabled={isPending}
          className="text-xs px-3 py-1.5 border border-border rounded hover:border-fg-secondary text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
        >
          {hidden ? "Unhide" : "Hide"}
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={remove}
            className="text-xs px-3 py-1.5 border border-danger/50 rounded text-danger hover:bg-danger/10 transition-colors duration-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}