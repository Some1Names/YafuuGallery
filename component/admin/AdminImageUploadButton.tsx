"use client";

import { useRef, useState } from "react";

interface AdminImageUploadButtonProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  // Tailwind aspect-ratio class — cover art and banners are shaped very
  // differently (poster vs. wide), so let the caller pick.
  aspectClassName?: string;
}

// Thin wrapper around the same /api/upload endpoint ProfileEditForm's
// avatar picker uses — click to open a file picker, uploads immediately,
// and hands the resulting blob URL back to the caller to hold in form
// state (this component doesn't persist anything itself).
export default function AdminImageUploadButton({
  label,
  value,
  onChange,
  aspectClassName = "aspect-square",
}: AdminImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        className={`group relative block w-full ${aspectClassName} overflow-hidden rounded border border-[#050505] bg-[#0a0a0a]`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-xs text-[#6b655e]">
            No image
          </span>
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
