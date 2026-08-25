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
  stats: { label: string; value: number }[];
}

export default function ProfileEditForm({
  initialName,
  initialImage,
  email,
  role,
  createdAt,
  authoredCount,
  stats,
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
    <div className="max-w-2xl">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile section */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

          {/* Avatar */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-32 h-32 sm:w-36 sm:h-36 overflow-hidden border border-[#050505] bg-[#1b1a1c]"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-3xl text-[#b6b0a2] font-(family-name:--font-display)">
                  {name.charAt(0).toUpperCase() || "?"}
                </span>
              )}

              {/* Hover overlay */}
              <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-[#ece6d8] font-mono transition-opacity duration-200">
                {isUploading ? "Uploading…" : "Change"}
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

          {/* Account information */}
          <div className="flex-1 min-w-0">

            {/* Name */}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-[10px] uppercase tracking-widest text-[#6b655e] font-mono mb-2"
              >
                Display name
              </label>

              <div className="relative">
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[#343237] px-0 py-2 pr-8 text-base text-[#ece6d8] outline-none focus:border-[#ece6d8] transition-colors"
                />

                <span className="absolute right-0 bottom-2 text-[#6b655e] text-sm">
                  ✎
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="mb-5 flex flex-row items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-[#6b655e] font-mono">
                Email
              </p>

              <p className="text-sm text-[#b6b0a2]">
                {email}
              </p>
            </div>

            {/* Metadata */}
            <div>
              <p className="text-xs text-[#6b655e] font-mono">
                {role} · member since{" "}
                {createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-[#9c1d25] font-mono">
            {error}
          </p>
        )}

        {/* Save */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#27262a]">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="px-4 py-2 bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>

          {saved && (
            <span className="text-xs text-[#6b655e] font-mono">
              Saved
            </span>
          )}
        </div>
      </form>

      {/* Activity — same slim, divider-based language as the sections
          above, instead of the old boxed grid-of-cards */}
      <div className="mt-8 pt-6 border-t border-[#27262a] flex">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 px-4 first:pl-0 ${i > 0 ? "border-l border-[#27262a]" : ""}`}
          >
            <p className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#6b655e] font-mono mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Author section */}
      {role === "author" && (
        <div className="mt-8 pt-6 border-t border-[#27262a] flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#ece6d8]">
              Your manga
            </p>

            <p className="text-xs text-[#6b655e] font-mono mt-1">
              {authoredCount} published
            </p>
          </div>

          <Link
            href="/admin"
            className="text-xs font-mono px-3 py-1.5 border border-[#343237] rounded text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
          >
            Manage manga →
          </Link>
        </div>
      )}

    </div>
  );
}