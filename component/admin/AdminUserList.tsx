"use client";

import { Fragment, useState, useSyncExternalStore } from "react";
import { ListRowSkeletons } from "@/component/Skeletons";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import AdminUserDeleteButton from "./AdminUserDeleteButton";
import AdminCommentList from "./AdminCommentList";
import AdminSearchInput from "./AdminSearchInput";
import LocalDate from "@/component/LocalDate";
import { useDebounced, usePagedList } from "./usePagedList";
import { formatUsername } from "@/lib/format-username";
import type { AdminUserItem } from "@/lib/admin-lists";
import { useTranslations } from "next-intl";

// Tailwind's sm breakpoint. Only one layout is rendered (not both with one
// hidden by CSS), so an opened user's comments — fetched on open — load once.
const WIDE_QUERY = "(min-width: 640px)";
function subscribeWide(onChange: () => void) {
  const mql = window.matchMedia(WIDE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// The admin Users tab: one page of users at a time from /api/admin/users,
// with search ("name", "name#tag", "#tag" or email) done server-side.
// Phones get one card per user; from sm up, a table. Both use the same
// per-user controls below.
export default function AdminUserList({ currentUserId }: { currentUserId: string }) {
  const t = useTranslations("AdminUsers");
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useState("");
  const q = useDebounced(search.trim());
  const { items, hasMore, isLoadingMore, error, loadMore, removeItem } = usePagedList<AdminUserItem>(
    "/api/admin/users",
    { q: q || undefined }
  );
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  // false on the server render — nothing user-specific shows until the
  // first page arrives from the API anyway, by which time this is settled
  const isWide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE_QUERY).matches, () => false);

  const userLabel = (u: AdminUserItem) => (u.name ? formatUsername(u.name, u.tag) : u.email);

  // No dropdown for yourself — changing your own role would drop your
  // admin access instantly (the API refuses it too).
  function roleControl(u: AdminUserItem) {
    if (u.id === currentUserId) {
      return (
        <span className="text-sm text-fg-secondary whitespace-nowrap">
          {t("you", { role: t(`roles.${u.role}`) })}
        </span>
      );
    }
    return <AdminUserRoleSelect userId={u.id} currentRole={u.role} userLabel={userLabel(u)} />;
  }

  function commentsButton(u: AdminUserItem) {
    const isExpanded = expandedUserId === u.id;
    return (
      <button
        type="button"
        onClick={() => setExpandedUserId((current) => (current === u.id ? null : u.id))}
        disabled={u.commentCount === 0}
        aria-expanded={isExpanded}
        className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary disabled:opacity-40 disabled:hover:text-fg-secondary disabled:hover:border-border transition-colors duration-200"
      >
        {t("commentCount", { count: u.commentCount })}{" "}
        {u.commentCount > 0 && (isExpanded ? t("closeComments") : t("viewComments"))}
      </button>
    );
  }

  function deleteControl(u: AdminUserItem) {
    return u.id === currentUserId ? null : (
      <AdminUserDeleteButton userId={u.id} userLabel={userLabel(u)} onDeleted={() => removeItem(u.id)} />
    );
  }

  // their comments, loaded (paged) only when opened
  const userComments = (u: AdminUserItem) => <AdminCommentList userId={u.id} />;

  return (
    <section>
      <AdminSearchInput value={search} onChange={setSearch} placeholder={t("search")} />

      {items === null ? (
        <ListRowSkeletons label={t("loading")} />
      ) : items.length === 0 ? (
        <div className="border border-border rounded-md bg-surface/60 py-6 px-4 mt-4 text-center text-sm text-fg-secondary">
          {error ? t("loadFailed") : q ? t("noMatch", { query: q }) : t("none")}
        </div>
      ) : (
        <>
          {/* Phones: one card per user. The 6-column table only fit by
              scrolling sideways there. */}
          {!isWide && (
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((u) => (
              <li key={u.id} className="border border-border rounded-md bg-surface/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-fg font-medium truncate">{u.name ? formatUsername(u.name, u.tag) : "—"}</div>
                    <div className="text-sm text-fg-secondary truncate">{u.email}</div>
                    <div className="text-xs text-fg-muted mt-0.5">
                      {t("joinedOn")} <LocalDate date={u.createdAt} />
                    </div>
                  </div>
                  <div className="shrink-0">{roleControl(u)}</div>
                </div>
                <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
                  {commentsButton(u)}
                  {deleteControl(u)}
                </div>
                {expandedUserId === u.id && <div className="mt-3">{userComments(u)}</div>}
              </li>
            ))}
          </ul>
          )}

          {/* sm and up: the table */}
          {isWide && (
          <div className="border border-border rounded-md overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-fg-secondary text-xs">
                    <th className="text-left px-4 py-2">{t("columns.name")}</th>
                    <th className="text-left px-4 py-2">{t("columns.email")}</th>
                    <th className="text-left px-4 py-2">{t("columns.joined")}</th>
                    <th className="text-left px-4 py-2">{t("columns.role")}</th>
                    <th className="text-left px-4 py-2">{t("columns.comments")}</th>
                    <th className="text-left px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u) => (
                    <Fragment key={u.id}>
                      <tr className="border-t border-border hover:bg-surface/40 transition-colors duration-200">
                        <td className="px-4 py-2 text-fg whitespace-nowrap">
                          {u.name ? formatUsername(u.name, u.tag) : "—"}
                        </td>
                        <td className="px-4 py-2 text-fg-secondary whitespace-nowrap">{u.email}</td>
                        <td className="px-4 py-2 text-fg-secondary whitespace-nowrap">
                          <LocalDate date={u.createdAt} />
                        </td>
                        <td className="px-4 py-2">{roleControl(u)}</td>
                        <td className="px-4 py-2">{commentsButton(u)}</td>
                        <td className="px-4 py-2">{deleteControl(u)}</td>
                      </tr>
                      {expandedUserId === u.id && (
                        <tr className="border-t border-border bg-bg/40">
                          <td colSpan={6} className="p-3">
                            {userComments(u)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

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
    </section>
  );
}
