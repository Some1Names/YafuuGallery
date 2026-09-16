"use client";

import { useRef, useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";

interface AdminPdfUploadButtonProps {
  mangaId: string;
  value: string | null;
  fileName: string | null;
  onChange: (url: string, fileName: string) => void;
}

const HARD_LIMIT_BYTES = 200 * 1024 * 1024;
const RECOMMENDED_BYTES = 50 * 1024 * 1024;

function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// Uploads go straight from the browser to R2 via a presigned URL (see
// /api/admin/chapters/pdf-upload-url) — a 200MB file would blow past
// Vercel's serverless request size limit if it were proxied through a
// Next.js API route instead. XMLHttpRequest (not fetch) is used for the
// actual PUT purely because it's the only one of the two that reports
// upload progress.
export default function AdminPdfUploadButton({ mangaId, value, fileName, onChange }: AdminPdfUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be re-selected later
    if (!file) return;

    setError(null);
    setWarning(null);

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > HARD_LIMIT_BYTES) {
      setError(`File too large (${formatMB(file.size)}) — the limit is 200MB.`);
      return;
    }

    if (file.size > RECOMMENDED_BYTES) {
      setWarning(`This file is ${formatMB(file.size)} — 50MB or under is recommended for faster loading.`);
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const presignRes = await fetch("/api/admin/chapters/pdf-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manga_id: mangaId, content_type: file.type, file_size: file.size }),
      });

      if (!presignRes.ok) {
        const data = await presignRes.json().catch(() => null);
        setError(data?.error ?? "Failed to prepare upload.");
        return;
      }

      const { uploadUrl, publicUrl } = await presignRes.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.send(file);
      });

      onChange(publicUrl, file.name);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#6b655e] mb-1.5">
        Chapter PDF
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded border border-[#050505] bg-[#0a0a0a] text-left hover:border-[#b6b0a2] transition-colors duration-200 disabled:opacity-60"
      >
        {value ? (
          <CheckCircle2 className="w-4 h-4 text-[#4c8f5f] shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-[#6b655e] shrink-0" />
        )}

        <span className="min-w-0 flex-1 text-sm text-[#ece6d8] truncate">
          {isUploading ? `Uploading… ${progress}%` : value ? (fileName ?? "PDF uploaded") : "No PDF uploaded"}
        </span>

        <span className="text-xs text-[#b6b0a2] shrink-0">{value ? "Replace" : "Upload"}</span>
      </button>

      {isUploading && (
        <div className="mt-1.5 h-1 rounded-full bg-[#0a0a0a] border border-[#050505] overflow-hidden">
          <div
            className="h-full bg-[#ece6d8] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />

      {warning && <p className="text-xs text-[#b6b0a2] mt-1">{warning}</p>}
      {error && <p className="text-xs text-[#9c1d25] mt-1">{error}</p>}
    </div>
  );
}
