"use client";

import { useState } from "react";
import { ListRowSkeletons } from "@/component/Skeletons";
import AdminCommentRow from "./AdminCommentRow";
import AdminSearchInput from "./AdminSearchInput";
import { useDebounced, usePagedList } from "./usePagedList";
import type { AdminCommentItem } from "@/lib/admin-lists";
import { useTranslations } from "next-intl";

interface AdminCommentListProps {
  // Only this user's comments (the Users tab's per-user view) — no search
  // box or filter then.
  userId?: string;
  // Authors (/manage) can hide/unhide but not delete.
  canDelete?: boolean;
  // Shown on the "Reported only" toggle — from the page's own count query.
  reportedTotal?: number;
  searchPlaceholder?: string;
  emptyText?: string;
}

// The moderation list: one page of comments at a time from
// /api/admin/comments (the server scopes it — everything for admins, own
// manga for authors), with search and "Reported only" done server-side so
// they cover every comment, not just the loaded ones.
export default function AdminCommentList({
  userId,
  canDelete = true,
  reportedTotal,
  searchPlaceholder,
  emptyText,
}: AdminCommentListProps) {
  const t = useTranslations("AdminComments");
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useState("");
  const [reportedOnly, setReportedOnly] = useState(false);
  const q = useDebounced(search.trim());
  const { items, hasMore, isLoadingMore, error, loadMore, removeItem, removeWhere, updateItem } = usePagedList<AdminCommentItem>(
    "/api/admin/comments",
    { userId, q: q || undefined, reported: reportedOnly ? "1" : undefined }
  );
  const showControls = !userId;

  return (
    <div>
      {showControls && (
        <>
          <AdminSearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder ?? t("searchDefault")} />
          {/* Moderation shortcut: just the comments readers have reported. */}
          <button
            type="button"
            onClick={() => setReportedOnly((v) => !v)}
            aria-pressed={reportedOnly}
            className={
              "mt-3 text-xs px-3 py-1.5 rounded border transition-colors duration-200 " +
              (reportedOnly
                ? "border-danger-text/60 text-danger-text"
                : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
            }
          >
            {reportedTotal !== undefined ? t("reportedOnlyCount", { count: reportedTotal }) : t("reportedOnly")}
          </button>
        </>
      )}

      {items === null ? (
        <ListRowSkeletons label={t("loading")} />
      ) : items.length === 0 ? (
        <div className="border border-border rounded-md bg-surface/60 py-12 px-6 text-center mt-4">
          <p className="text-fg-secondary text-sm">
            {error
              ? t("loadFailed")
              : q
                ? t(reportedOnly ? "noMatchReported" : "noMatch", { query: q })
                : reportedOnly
                  ? t("noReported")
                  : (emptyText ?? t("emptyDefault"))}
          </p>
        </div>
      ) : (
        <>
          <div className={"flex flex-col gap-2 " + (showControls ? "mt-4" : "")}>
            {items.map((c) => (
              <AdminCommentRow
                key={c.id}
                commentId={c.id}
                body={c.body}
                userName={c.userName}
                userTag={c.userTag}
                chapterLabel={c.chapterLabel}
                chapterId={c.chapterId}
                replyToName={c.replyToName}
                createdAt={c.createdAt}
                initialHidden={c.hidden}
                reportCount={c.reportCount}
                canDelete={canDelete}
                // deleting a comment deletes its replies too — drop them as well
                onDeleted={() => removeWhere((x) => x.id === c.id || x.parentId === c.id)}
                onReportsDismissed={() =>
                  // under "Reported only" it no longer belongs in the list
                  reportedOnly ? removeItem(c.id) : updateItem(c.id, { reportCount: 0 })
                }
              />
            ))}
          </div>
          {error && <p className="text-xs text-danger-text mt-3">{t("loadMoreFailed")}</p>}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="text-sm px-4 py-2 border border-border rounded-md text-fg-secondary hover:text-fg hover:border-fg-secondary disabled:opacity-50 transition-colors duration-200"
              >
                {isLoadingMore ? tCommon("loading") : tCommon("showMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
