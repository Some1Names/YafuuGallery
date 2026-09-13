"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Pencil, ArrowUpRight } from "lucide-react";

interface ProfileEditFormProps {
  initialName: string;
  initialImage: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  createdAt: Date;
  stats: { label: string; value: number; href?: string }[];
}

export default function ProfileEditForm({
  initialName,
  initialImage,
  email,
  role,
  createdAt,
  stats,
}: ProfileEditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState<string | null>(initialImage);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared save path for both the name edit (blur/Enter) and the avatar
  // upload — neither has its own explicit "Save" button anymore, so each
  // persists itself as soon as its edit is committed.
  async function saveProfile(nextName: string, nextImage: string | null) {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName, image: nextImage }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to save.");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSaving(false);
    }
  }

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
      await saveProfile(name, data.url);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function startEditingName() {
    setError(null);
    setIsEditingName(true);
    requestAnimationFrame(() => nameInputRef.current?.select());
  }

  // Explicit confirm/cancel instead of save-on-blur — clicking away (or
  // just tabbing past the field) no longer silently commits a change.
  async function confirmNameEdit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name can't be empty");
      return;
    }

    setIsEditingName(false);
    setName(trimmed);
    await saveProfile(trimmed, image);
  }

  function cancelNameEdit() {
    setError(null);
    setName(initialName);
    setIsEditingName(false);
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmNameEdit();
    } else if (e.key === "Escape") {
      cancelNameEdit();
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr]">
      {/* Avatar — a modest centered circle on mobile (a full-bleed square
          would otherwise be as wide as the whole stacked card); from sm up
          it becomes the flush square side panel: CSS grid (unlike flexbox)
          resolves aspect-ratio correctly against a sibling-driven stretched
          height */}
      <div className="p-6 sm:p-0">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative block w-28 h-28 mx-auto rounded-full sm:mx-0 sm:w-auto sm:h-full sm:aspect-square sm:rounded-none overflow-hidden bg-[#1b1a1c]"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-4xl text-[#b6b0a2] font-(family-name:--font-display)">
              {name.charAt(0).toUpperCase() || "?"}
            </span>
          )}

          {/* Hover overlay */}
          <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-[#ece6d8] transition-opacity duration-200">
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

      {/* Content */}
      <div className="min-w-0 flex flex-col p-6 sm:p-8">
        {/* Name — read-only until the pencil is clicked; saves itself on
            blur/Enter instead of a separate Save button */}
        <div>
          <label
            htmlFor="name"
            className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-2"
          >
            Display name
          </label>

          <div className="flex items-start gap-3">
            <div className="relative max-w-xs w-full">
              <input
                ref={nameInputRef}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                readOnly={!isEditingName}
                className={
                  "w-full bg-transparent border-b px-0 py-2 text-base text-[#ece6d8] outline-none transition-colors " +
                  (isEditingName ? "border-[#ece6d8] pr-16" : "border-[#050505] cursor-default pr-8")
                }
              />

              {isEditingName ? (
                <div className="absolute right-0 bottom-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={confirmNameEdit}
                    disabled={isSaving}
                    aria-label="Confirm name change"
                    className="p-1 text-[#6b655e] hover:text-[#4ade80] disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelNameEdit}
                    disabled={isSaving}
                    aria-label="Cancel name change"
                    className="p-1 text-[#6b655e] hover:text-[#9c1d25] disabled:opacity-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEditingName}
                  aria-label="Edit display name"
                  className="absolute right-0 bottom-2 text-[#6b655e] hover:text-[#ece6d8] transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>

            {error && <p className="text-sm text-[#9c1d25] pt-2">{error}</p>}
            {isSaving && <p className="text-xs text-[#6b655e] pt-2">Saving…</p>}
          </div>
        </div>

        {/* Role / email / member-since, with the manage-manga action
            alongside it for authors and admins */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#ece6d8] font-bold uppercase tracking-wide">{role}</p>
            <p className="text-sm text-[#b6b0a2] mt-1">{email}</p>
            <p className="text-xs text-[#6b655e] mt-1">
              member since{" "}
              {createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>

          {(role === "author" || role === "admin") && (
            <Link
              href={role === "admin" ? "/admin" : "/manage"}
              className="self-start shrink-0 text-xs uppercase tracking-wide px-3 py-1.5 rounded bg-[#232224] border border-[#050505] text-[#ece6d8] hover:bg-[#2a292c] hover:border-[#b6b0a2] transition-colors duration-200"
            >
              {role === "admin" ? "Admin panel" : "Manage manga"}
            </Link>
          )}
        </div>

        {/* Stats — favorite counts link straight to the matching favorites
            tab instead of just sitting there as inert numbers. 2-column
            grid on mobile (a single unwrapped row of 4 was overflowing off
            the right edge of the card), one row from sm up. */}
        <div className="mt-6 pt-6 border-t border-[#050505] grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:gap-0">
          {stats.map((s, i) => {
            const className = `sm:flex-1 sm:px-4 sm:first:pl-0 ${i > 0 ? "sm:border-l sm:border-[#050505]" : ""}`;
            const inner = (
              <>
                <p className="text-2xl text-[#ece6d8] group-hover:text-white font-(family-name:--font-display) transition-colors duration-200">
                  {s.value}
                </p>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#6b655e] group-hover:text-[#b6b0a2] mt-1 transition-colors duration-200">
                  {s.label}
                  {s.href && <ArrowUpRight className="w-3 h-3" />}
                </p>
              </>
            );

            return s.href ? (
              <Link key={s.label} href={s.href} className={`${className} group`}>
                {inner}
              </Link>
            ) : (
              <div key={s.label} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
