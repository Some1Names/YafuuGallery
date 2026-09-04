"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "./AdminImageUploadButton";

interface AdminMangaCreateFormProps {
  authors: { id: string; name: string | null; email: string }[];
}

export default function AdminMangaCreateForm({ authors }: AdminMangaCreateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [authorId, setAuthorId] = useState(authors[0]?.id ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/manga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_title: title,
          manga_synopsis: synopsis,
          author_id: authorId,
          cover_image_url: coverImageUrl,
          banner_image_url: bannerImageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create manga.");
        return;
      }

      setTitle("");
      setSynopsis("");
      setCoverImageUrl(null);
      setBannerImageUrl(null);
      router.refresh(); // re-runs the server component's data fetch
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#050505] rounded-md p-4 bg-[#1b1a1c] flex flex-col gap-3 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-[8rem_1fr] gap-3">
        <AdminImageUploadButton
          label="Cover"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          aspectClassName="aspect-2/3"
        />
        <AdminImageUploadButton
          label="Banner"
          value={bannerImageUrl}
          onChange={setBannerImageUrl}
          aspectClassName="aspect-32/9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Manga title"
          required
          className="bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e]"
        />
        <textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="Synopsis"
          required
          rows={1}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] resize-none"
        />
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          className="bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8]"
        >
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name ?? a.email}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !authorId}
        className="self-start px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? "Creating…" : "+ Create manga"}
      </button>
    </form>
  );
}
