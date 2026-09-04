"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploadButton from "@/component/admin/AdminImageUploadButton";

// Same as AdminMangaCreateForm minus the author picker — the signed-in
// author is always the author, so the server infers it from the session
// instead of taking it from the request body.
export default function ManageMangaCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
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
      router.refresh();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      </div>

      {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? "Creating…" : "+ Create manga"}
      </button>
    </form>
  );
}
