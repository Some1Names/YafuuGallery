"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { processImageForUpload } from "@/lib/image-processing";

interface AdminImageUploadButtonProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  // Full control over the box's size/shape (width, height, aspect-ratio) —
  // cover art and banners aren't just different aspect ratios but sometimes
  // different sizing strategies entirely (fixed width vs. fixed height), so
  // the caller owns the whole class string rather than just a ratio.
  boxClassName?: string;
  // Numeric width/height ratio (e.g. 2/3) the upload gets center-cropped
  // to before it's compressed and uploaded — should match boxClassName's
  // own ratio. Omit to keep the source image's own aspect ratio.
  aspectRatio?: number;
  // Classes for the outer wrapper (label + box) — e.g. its grid placement.
  className?: string;
}

// Thin wrapper around the same /api/upload endpoint ProfileEditForm's
// avatar picker uses — click to open a file picker, uploads immediately,
// and hands the resulting blob URL back to the caller to hold in form
// state (this component doesn't persist anything itself).
export default function AdminImageUploadButton({
  label,
  value,
  onChange,
  boxClassName = "w-full aspect-square",
  aspectRatio,
  className,
}: AdminImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    // Center-crops to aspectRatio and downscales/re-encodes to fit
    // comfortably under the server's size limit — replaces the old
    // "reject anything over 2000px" behavior, since most phone photos are
    // already past that.
    let processed: File;
    try {
      processed = await processImageForUpload(file, { aspectRatio });
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
      onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // lets the same file be re-selected later
    }
  }

  return (
    <div className={className}>
      <label className="block text-xs text-fg-secondary mb-1.5">
        {label}
      </label>

      {/* The label above isn't a <label for> (there's no input to point
          at — the file input is hidden), so the button carries its own
          name for screen readers: "Upload cover image" / "Change cover
          image" / "Uploading cover image". */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label={`${isUploading ? "Uploading" : value ? "Change" : "Upload"} ${label.toLowerCase()} image`}
        aria-busy={isUploading}
        className={`group relative block ${boxClassName} overflow-hidden rounded border border-border bg-bg`}
      >
        {value ? (
          <NextImage src={value} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
        ) : (
          <NoImagePlaceholder label="No image" />
        )}

        {/* "Change" on hover; "Uploading…" always while it runs — it used
            to show only on hover, so on a phone nothing said an upload
            was in progress */}
        <span
          aria-hidden="true"
          className={
            "absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white transition-opacity duration-200 " +
            (isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100")
          }
        >
          {isUploading ? "Uploading…" : "Change"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p role="alert" className="text-xs text-danger-text mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
