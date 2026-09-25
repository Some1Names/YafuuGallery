"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { Check, X, Pencil, ArrowUpRight, Camera } from "lucide-react";
import { processImageForUpload } from "@/lib/image-processing";
import LocalDate from "@/component/LocalDate";
import { displayNameSchema, MAX_DISPLAY_NAME_LENGTH } from "@/lib/signup-schema";

interface ProfileEditFormProps {
  initialName: string;
  initialImage: string | null;
  tag: string | null;
  email: string;
  role: "reader" | "author" | "admin";
  createdAt: Date;
  stats: { label: string; value: number; href?: string }[];
}

export default function ProfileEditForm({
  initialName,
  initialImage,
  tag,
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

  // Shared save path for both the name edit and the avatar upload — neither
  // has its own explicit "Save" button, so each persists itself as soon as
  // its edit is committed. Sends only the field being changed. Returns
  // whether it saved, so callers can keep their edit state on failure.
  async function saveProfile(changes: { name?: string; image?: string | null }): Promise<boolean> {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to save.");
        return false;
      }

      router.refresh();
      return true;
    } catch {
      setError("Network error — please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    // Center-crops to a square and downscales/re-encodes to fit comfortably
    // under the server's size limit — replaces the old "reject anything
    // over 2000px" behavior, since most phone photos are already past that.
    let processed: File;
    try {
      processed = await processImageForUpload(file, { aspectRatio: 1 });
    } catch {
      setError("Couldn't read that image — please try a different file.");
      setIsUploading(false);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", processed);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      // Only show the new avatar once it's actually saved to the profile.
      if (await saveProfile({ image: data.url })) setImage(data.url);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
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
    // Same rule as signup and the server (lib/signup-schema.ts).
    const parsed = displayNameSchema.safeParse(name);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setName(parsed.data);
    // Stay in edit mode if the save fails, so the field doesn't sit there
    // showing an unsaved name as if it had been saved.
    if (await saveProfile({ name: parsed.data })) setIsEditingName(false);
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
          disabled={isUploading}
          aria-label={isUploading ? "Uploading profile picture" : "Change profile picture"}
          // Password-manager/form-filler extensions tag interactive elements
          // with a `fdprocessedid` attribute before React hydrates, which
          // React would otherwise flag as a hydration mismatch even though
          // nothing about our own render output changed.
          suppressHydrationWarning
          className="group relative block w-28 h-28 mx-auto rounded-full sm:mx-0 sm:w-auto sm:h-full sm:aspect-square sm:rounded-none overflow-hidden bg-surface"
        >
          {image ? (
            // fill (not just w-full/h-full) — the button's width is `auto`,
            // sized by CSS grid off its own content so it can match the
            // sibling column's height via aspect-square. Percentage sizing
            // on the image can't help that: grid's track-sizing pass
            // resolves percentages against nothing yet defined, so it falls
            // back to the image's raw intrinsic pixel dimensions as the
            // content size — a large upload was blowing the column out to
            // its native resolution. fill's own absolute positioning
            // removes it from that sizing pass entirely.
            <NextImage src={image} alt="Avatar" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-4xl text-fg-secondary font-(family-name:--font-display)">
              {name.charAt(0).toUpperCase() || "?"}
            </span>
          )}

          {/* Overlay: "Change" on hover (desktop), but held visible for the
              whole upload so a phone user — who never hovers — still sees
              that something's happening. */}
          <span
            aria-hidden="true"
            className={
              "absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white transition-opacity duration-200 " +
              (isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100")
            }
          >
            {isUploading ? "Uploading…" : "Change"}
          </span>

          {/* Always-visible camera badge — touch screens have no hover, so
              without it nothing says the avatar can be tapped to change it. */}
          {!isUploading && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-fg/20 flex items-center justify-center text-fg"
            >
              <Camera className="w-4 h-4" />
            </span>
          )}
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
          <label htmlFor="name" className="block text-xs text-fg-secondary mb-1">
            Display name
          </label>

          {/* items-baseline: the error / "Saving…" text sits on the same text
              line as the name in the input, not top-aligned to the field box
              (which left the smaller text floating ~4px above the name). */}
          <div className="flex items-baseline gap-3">
            <div className="relative max-w-xs w-full">
              <input
                ref={nameInputRef}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                readOnly={!isEditingName}
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                suppressHydrationWarning
                className={
                  "w-full bg-transparent border-b px-0 py-2 text-base text-fg outline-none transition-colors " +
                  (isEditingName ? "border-fg pr-16" : "border-border cursor-default pr-8")
                }
              />

              {isEditingName ? (
                <div className="absolute right-0 bottom-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={confirmNameEdit}
                    disabled={isSaving}
                    aria-label="Confirm name change"
                    className="p-1 text-fg-muted hover:text-success disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelNameEdit}
                    disabled={isSaving}
                    aria-label="Cancel name change"
                    className="p-1 text-fg-muted hover:text-danger disabled:opacity-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEditingName}
                  aria-label="Edit display name"
                  suppressHydrationWarning
                  className="absolute right-0 bottom-2 text-fg-muted hover:text-fg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}
            {isSaving && <p className="text-xs text-fg-muted whitespace-nowrap">Saving…</p>}
          </div>

          {/* Fixed for the life of the account (see User.tag in the
              schema) — shown here, not editable, so people understand
              their full identity elsewhere (comments, admin) is
              name#tag, not just the name they can freely change above. */}
          {tag && <p className="text-xs text-fg-muted mt-2">Your tag is #{tag} — shown as {name}#{tag}, and never changes.</p>}
        </div>

        {/* Email / member-since, with a role badge and the manage-manga
            action for authors and admins. Plain readers don't get a role
            line at all — "reader" is an internal account type, not
            something they need shown back to them. */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            {role !== "reader" && (
              <span className="inline-flex mb-2 px-2 py-0.5 rounded-full border border-fg/25 text-xs font-medium text-fg">
                {role === "admin" ? "Admin" : "Author"}
              </span>
            )}
            <p className="text-sm text-fg-secondary">{email}</p>
            <p className="text-xs text-fg-muted mt-1">
              Member since <LocalDate date={createdAt} options={{ month: "long", year: "numeric" }} />
            </p>
          </div>

          {(role === "author" || role === "admin") && (
            <Link
              href={role === "admin" ? "/admin" : "/manage"}
              className="self-start shrink-0 flex items-center h-9 px-4 rounded-md border border-fg/25 text-sm font-medium text-fg hover:border-fg/60 transition-colors duration-200"
            >
              {role === "admin" ? "Admin panel" : "Manage manga"}
            </Link>
          )}
        </div>

        {/* Stats — favorite counts link straight to the matching favorites
            tab instead of just sitting there as inert numbers. 2-column
            grid on mobile (a single unwrapped row of 4 was overflowing off
            the right edge of the card), one row from sm up. */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:gap-0">
          {stats.map((s, i) => {
            const className = `sm:flex-1 sm:px-4 sm:first:pl-0 ${i > 0 ? "sm:border-l sm:border-border" : ""}`;
            const inner = (
              <>
                <p className="text-2xl text-fg group-hover:text-fg-hover font-(family-name:--font-display) transition-colors duration-200">
                  {s.value}
                </p>
                <p className="flex items-center gap-1 text-xs text-fg-secondary group-hover:text-fg mt-1 transition-colors duration-200">
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
