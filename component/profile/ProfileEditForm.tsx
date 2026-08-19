"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileEditFormProps {
  initialName: string;
  initialImage: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  createdAt: Date;
  authoredCount: number;
}

export default function ProfileEditForm({
  initialName,
  initialImage,
  email,
  role,
  createdAt,
  authoredCount,
}: ProfileEditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setImage(data.url);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to save.");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      {/* Identity — merged in from ProfileHeader */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <p className="text-sm text-[#b6b0a2]">{email}</p>
          <p className="text-xs text-[#6b655e] font-mono mt-1">
            {role} · member since{" "}
            {createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        {role === "author" && (
          <Link
            href="/admin"
            className="text-xs font-mono px-3 py-1.5 border border-[#050505] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
          >
            Manage {authoredCount} manga
          </Link>
        )}
      </div>

      <form onSubmit={handleSave} className="flex gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-64 h-64 overflow-hidden border border-[#050505] bg-[#1b1a1c] shrink-0"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-xl text-[#b6b0a2] font-(family-name:--font-display)">
                {name.charAt(0).toUpperCase() || "?"}
              </span>
            )}
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#ece6d8] font-mono transition-opacity duration-200">
              {isUploading ? "…" : "Change"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-xl text-[#b6b0a2] mb-1.5">
            Display name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full max-w-sm rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 text-sm text-[#ece6d8] focus:outline-none focus:border-[#9c1d25] transition-colors"
          />
        </div>

        {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200 w-fit"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-xs text-[#b6b0a2] font-mono">Saved</span>}
        </div>
      </form>
    </div>
  );
}