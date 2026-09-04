"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminArcCreateFormProps {
  mangaId: string;
  nextOrder: number;
}

// Always scoped to one manga (nested inside its AdminMangaRow), so there's
// no manga picker here — just name, order, and status.
export default function AdminArcCreateForm({ mangaId, nextOrder }: AdminArcCreateFormProps) {
  const router = useRouter();
  const [arcName, setArcName] = useState("");
  const [arcOrder, setArcOrder] = useState(String(nextOrder));
  const [arcStatus, setArcStatus] = useState<"ongoing" | "completed">("ongoing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/arcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_id: mangaId,
          arc_name: arcName,
          arc_order: Number(arcOrder),
          arc_status: arcStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create arc.");
        return;
      }

      setArcName("");
      setArcOrder(String(nextOrder + 1));
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#050505] rounded-md p-3 bg-[#0a0a0a] flex flex-col gap-2"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input
          value={arcName}
          onChange={(e) => setArcName(e.target.value)}
          placeholder="Arc name"
          required
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e]"
        />

        <input
          type="number"
          min="0"
          step="1"
          value={arcOrder}
          onChange={(e) => setArcOrder(e.target.value)}
          placeholder="# (0+)"
          required
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e]"
        />

        <select
          value={arcStatus}
          onChange={(e) => setArcStatus(e.target.value as "ongoing" | "completed")}
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8]"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <p className="text-xs text-[#9c1d25]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-3 py-1.5 bg-[#ece6d8] text-[#0a0a0a] text-xs font-mono font-semibold rounded disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? "Creating…" : "+ Create arc"}
      </button>
    </form>
  );
}
