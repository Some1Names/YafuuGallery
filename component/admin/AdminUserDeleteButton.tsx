"use client";

import { useRouter } from "next/navigation";
import { alertDialog, confirmDialog } from "@/component/Dialog";

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

  async function remove() {
    const confirmed = await confirmDialog({
      title: `Delete ${userLabel}?`,
      message:
        "Their comments (and any replies to them), favorites and reading history will be deleted too. This can't be undone.",
      confirmLabel: "Delete user",
      tone: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      onDeleted?.();
      router.refresh(); // the tab counts on the page
    } else {
      const data = await res.json().catch(() => null);
      await alertDialog({ title: "Couldn't delete user", message: data?.error ?? "Please try again." });
    }
  }

  return (
    <button
      onClick={remove}
      className="text-xs px-2 py-1 border border-danger/50 rounded text-danger hover:bg-danger/10 transition-colors duration-200"
    >
      Delete
    </button>
  );
}
