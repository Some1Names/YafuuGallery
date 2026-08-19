"use client";

import { useRouter } from "next/navigation";

export default function AdminUserDeleteButton({ userId, userLabel }: { userId: string; userLabel: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Delete ${userLabel}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Failed to delete user.");
    }
  }

  return (
    <button
      onClick={remove}
      className="text-xs font-mono px-2 py-1 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
    >
      Delete
    </button>
  );
}
