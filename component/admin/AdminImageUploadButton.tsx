"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import { MAX_IMAGE_DIMENSION } from "@/lib/image-dimensions";

// Reads a picked file's pixel dimensions in-browser before uploading, so an
// oversized image is rejected instantly instead of after a round trip to
// the server (which enforces the same limit either way, since this check
// is easy to bypass).
function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read image"));
    };
    img.src = url;
  });
}

interface AdminImageUploadButtonProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  // Full control over the box's size/shape (width, height, aspect-ratio) —
  // cover art and banners aren't just different aspect ratios but sometimes
  // different sizing strategies entirely (fixed width vs. fixed height), so
  // the caller owns the whole class string rather than just a ratio.
  boxClassName?: string;
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
}: AdminImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const { width, height } = await readImageDimensions(file);
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        setError(`Image too large (max ${MAX_IMAGE_DIMENSION}px on either side)`);
        e.target.value = "";
        return;
      }
    } catch {
      setError("Couldn't read that image — please try a different file.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

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
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
        {label}
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative block ${boxClassName} overflow-hidden rounded border border-[#050505] bg-[#0a0a0a]`}
      >
        {value ? (
          <NextImage src={value} alt={label} fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
        ) : (
          <NoImagePlaceholder label="No image" />
        )}

        <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-[#ece6d8] transition-opacity duration-200">
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

      {error && <p className="text-xs text-[#9c1d25] mt-1">{error}</p>}
    </div>
  );
}
