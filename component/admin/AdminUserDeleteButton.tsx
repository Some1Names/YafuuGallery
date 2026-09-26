"use client";

import { useRouter } from "next/navigation";
import { alertRequestFailed, confirmDialog } from "@/component/Dialog";
import { useTranslations } from "next-intl";

export default function AdminUserDeleteButton({
  userId,
  userLabel,
  onDeleted,
}: {
  userId: string;
  userLabel: string;
  // lets the (paged) users list drop the row without refetching
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("AdminUsers");
  const tCommon = useTranslations("Common");

  async function remove() {
    const confirmed = await confirmDialog({
      title: t("deleteTitle", { user: userLabel }),
      message: t("deleteMessage"),
      confirmLabel: t("deleteConfirm"),
      tone: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) return alertRequestFailed(t("deleteFailed"), res);
    onDeleted?.();
    router.refresh(); // the tab counts on the page
  }

  return (
    <button
      onClick={remove}
      className="text-xs px-2 py-1 border border-danger-text/50 rounded text-danger-text hover:bg-danger/10 transition-colors duration-200"
    >
      {tCommon("delete")}
    </button>
  );
}
