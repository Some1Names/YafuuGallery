"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminArcRowProps {
  id: string;
  name: string;
  order: number;
  status: "ongoing" | "completed";
}

export default function AdminArcRow({ id, name, order, status }: AdminArcRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editOrder, setEditOrder] = useState(String(order));
  const [editStatus, setEditStatus] = useState<"ongoing" | "completed">(status);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setIsSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/arcs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        arc_name: editName,
        arc_order: Number(editOrder),
        arc_status: editStatus,
      }),
    });

    setIsSaving(false);

    if (res.ok) {
      setIsEditing(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to save.");
    }
  }

  async function remove() {
    if (
      !confirm(
        `Delete arc "${name}"? Chapters assigned to it will become unassigned, not deleted. This can't be undone.`
      )
    )
      return;
    const res = await fetch(`/api/admin/arcs/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  if (isEditing) {
    return (
      <div className="border border-[#9c1d25] rounded-md p-2.5 bg-[#0a0a0a] flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={editOrder}
            onChange={(e) => setEditOrder(e.target.value)}
            className="sm:w-24 bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8]"
          />
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8]"
          />
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as "ongoing" | "completed")}
            className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8]"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && <p className="text-xs text-[#9c1d25]">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={isSaving}
            className="text-xs px-3 py-1.5 bg-[#ece6d8] text-[#0a0a0a] rounded disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#050505] rounded-md p-2.5 bg-[#0a0a0a] flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-[#ece6d8] font-medium truncate">
          #{String(order).padStart(3, "0")} — {name}
        </p>
        <p className="text-xs text-[#b6b0a2] mt-0.5 truncate capitalize">{status}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={remove}
          className="text-xs px-3 py-1.5 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
