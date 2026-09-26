"use client";

import { useState, useTransition } from "react";
import { alertRequestFailed, confirmDialog } from "@/component/Dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LocalDate from "@/component/LocalDate";
import { formatUsername } from "@/lib/format-username";
import { useTranslations } from "next-intl";

// date and time — several comments can land on the same day
const POSTED_AT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

interface AdminCommentRowProps {
  commentId: string;
  body: string;
  userName: string;
  userTag: string | null;
  chapterLabel: string;
  // the chapter it was posted on — the label links there
  chapterId: string;
  // set for replies: who the reply answers (display name incl. tag)
  replyToName?: string | null;
  createdAt: Date | string;
  initialHidden: boolean;
  // How many readers have reported this comment (0 = none).
  reportCount: number;
  // Authors (on /manage) can hide/unhide comments on their own manga but
  // not permanently delete them — the delete route is admin-only.
  canDelete?: boolean;
  // Let the list this row sits in update itself (drop a deleted row, clear
  // its report count) instead of refetching everything.
  onDeleted?: () => void;
  onReportsDismissed?: () => void;
}

export default function AdminCommentRow({
  commentId,
  body,
  userName,
  userTag,
  chapterLabel,
  chapterId,
  replyToName = null,
  createdAt,
  initialHidden,
  reportCount,
  canDelete = true,
  onDeleted,
  onReportsDismissed,
}: AdminCommentRowProps) {
  const t = useTranslations("AdminComments");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [hidden, setHidden] = useState(initialHidden);
  const [isPending, startTransition] = useTransition();
  // Delete / Dismiss reports in flight — disabled meanwhile, so a double
  // tap can't send (and fail) the same request twice
  const [isWorking, setIsWorking] = useState(false);

  // Dismissing clears the reports (the comment stays up) — refresh so the
  // dashboard's "Reported" filter/count update too.
  async function dismissReports() {
    setIsWorking(true);
    const res = await fetch(`/api/admin/comments/${commentId}/reports`, { method: "DELETE" }).catch(() => null);
    setIsWorking(false);
    if (!res?.ok) return alertRequestFailed(t("dismissFailed"), res);
    onReportsDismissed?.();
    router.refresh(); // the tab counts on the page
  }

  function toggleHide() {
    const previous = hidden;
    setHidden(!hidden);

    startTransition(async () => {
      const res = await fetch(`/api/admin/comments/${commentId}/hide`, { method: "POST" }).catch(() => null);
      if (!res?.ok) {
        setHidden(previous);
        // not awaited, so the button isn't left pending while it's open
        void alertRequestFailed(previous ? t("unhideFailed") : t("hideFailed"), res);
        return;
      }
      const data = await res.json();
      setHidden(data.hidden);
    });
  }

  async function remove() {
    if (isWorking) return;
    const confirmed = await confirmDialog({
      title: t("deleteTitle"),
      message: t("deleteMessage"),
      confirmLabel: tCommon("delete"),
      tone: "danger",
    });
    if (!confirmed) return;
    setIsWorking(true);
    const res = await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      setIsWorking(false);
      return alertRequestFailed(t("deleteFailed"), res);
    }
    onDeleted?.();
    router.refresh(); // the tab counts on the page
  }

  // Phones: the action buttons go under the comment (side by side they
  // left the text ~70px wide). From sm up they sit on the right as before.
  return (
    <div className="border border-border rounded-md p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <div className="text-xs text-fg-secondary mb-1">
          {formatUsername(userName, userTag)}
          {replyToName && <span className="text-fg-muted"> {t("replyTo", { name: replyToName })}</span>} ·{" "}
          {/* opens the chapter in a new tab so the moderation list (and its
              search/filter) is still here to come back to */}
          <Link
            href={`/viewer/${chapterId}`}
            target="_blank"
            rel="noopener"
            title={t("openChapter")}
            className="inline-flex items-center gap-0.5 text-fg-secondary underline underline-offset-2 decoration-fg/25 hover:text-fg hover:decoration-fg/60 transition-colors duration-200"
          >
            {chapterLabel}
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          </Link>{" "}
          · <LocalDate date={createdAt} options={POSTED_AT} />
          {hidden && <span className="text-danger-text"> · {t("hiddenTag")}</span>}
          {reportCount > 0 && (
            <span className="text-danger-text">
              {" "}
              · {t("reported", { count: reportCount })}
            </span>
          )}
        </div>
        {/* keep the author's line breaks; long links/strings wrap instead of
            running out of the row */}
        {/* A hidden comment's text is faded (the row's buttons stay at
            full strength — faded, Unhide looked disabled) */}
        <p className={"text-sm text-fg whitespace-pre-wrap wrap-anywhere " + (hidden ? "opacity-50" : "")}>{body}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0">
        {reportCount > 0 && (
          <button
            type="button"
            onClick={dismissReports}
            disabled={isWorking}
            className="text-xs px-3 py-3 sm:py-1.5 border border-border rounded hover:border-fg-secondary text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
          >
            {t("dismissReports")}
          </button>
        )}
        <button
          type="button"
          onClick={toggleHide}
          disabled={isPending}
          className="text-xs px-3 py-3 sm:py-1.5 border border-border rounded hover:border-fg-secondary text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
        >
          {hidden ? t("unhide") : t("hide")}
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={remove}
            disabled={isWorking}
            className="text-xs px-3 py-3 sm:py-1.5 border border-danger-text/50 rounded text-danger-text hover:bg-danger/10 disabled:opacity-50 transition-colors duration-200"
          >
            {tCommon("delete")}
          </button>
        )}
      </div>
    </div>
  );
}