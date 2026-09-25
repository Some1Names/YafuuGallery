"use client";

import { useRouter } from "next/navigation";

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
    if (
      !confirm(
        `Delete ${userLabel}?

Their comments (and any replies to them), favorites and reading history will be deleted too. This can't be undone.`
      )
    )
      return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      onDeleted?.();
      router.refresh(); // the tab counts on the page
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Failed to delete user.");
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
