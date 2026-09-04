"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminChapterCreateFormProps {
  mangaId: string;
  arcs: { id: string; arc_name: string }[];
}

// Always scoped to one manga now (nested inside its AdminMangaRow), so
// there's no manga picker here — just arc, number, title, date.
export default function AdminChapterCreateForm({ mangaId, arcs }: AdminChapterCreateFormProps) {
  const router = useRouter();
  const [arcId, setArcId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [publishedDate, setPublishedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_id: mangaId,
          arc_id: arcId || null,
          chapter_number: Number(chapterNumber),
          chapter_name: chapterName,
          published_date: publishedDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create chapter.");
        return;
      }

      setChapterNumber("");
      setChapterName("");
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
        <select
          value={arcId}
          onChange={(e) => setArcId(e.target.value)}
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8]"
        >
          <option value="">No arc</option>
          {arcs.map((a) => (
            <option key={a.id} value={a.id}>
              {a.arc_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          step="1"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          placeholder="# (0+)"
          required
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e]"
        />

        <input
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          placeholder="Chapter title"
          required
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8] placeholder:text-[#6b655e]"
        />

        <input
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          required
          className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1.5 text-sm text-[#ece6d8]"
        />
      </div>

      {error && <p className="text-xs text-[#9c1d25]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-3 py-1.5 bg-[#ece6d8] text-[#0a0a0a] text-xs font-mono font-semibold rounded disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? "Creating…" : "+ Create chapter"}
      </button>
    </form>
  );
}
