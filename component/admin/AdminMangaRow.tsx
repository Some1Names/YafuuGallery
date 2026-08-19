"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminMangaRowProps {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
}

export default function AdminMangaRow({ id, title, synopsis, authorName, chapterCount }: AdminMangaRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSynopsis, setEditSynopsis] = useState(synopsis);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    const res = await fetch(`/api/admin/manga/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manga_title: editTitle, manga_synopsis: editSynopsis }),
    });
    setIsSaving(false);
    if (res.ok) {
      setIsEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm(`Delete "${title}"? This deletes all its arcs and chapters too. This can't be undone.`)) return;
    const res = await fetch(`/api/admin/manga/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  if (isEditing) {
    return (
      <div className="border border-[#9c1d25] rounded-md p-3 bg-[#1b1a1c] flex flex-col gap-2">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8]"
        />
        <textarea
          value={editSynopsis}
          onChange={(e) => setEditSynopsis(e.target.value)}
          rows={2}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8] resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={isSaving}
            className="text-xs font-mono px-3 py-1.5 bg-[#ece6d8] text-[#0a0a0a] rounded disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs font-mono px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#050505] rounded-md p-3 bg-[#1b1a1c] flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Link href={`/manga/titles/${id}`} className="text-sm text-[#ece6d8] hover:underline font-medium">
          {title}
        </Link>
        <p className="text-xs text-[#b6b0a2] mt-0.5">
          {authorName} · {chapterCount} chapters
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs font-mono px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={remove}
          className="text-xs font-mono px-3 py-1.5 border border-[#9c1d25]/50 rounded text-[#9c1d25] hover:bg-[#9c1d25]/10 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
