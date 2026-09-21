"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";
import { formatBytes } from "@/lib/format-bytes";

interface OrphanedObject {
  key: string;
  size: number;
}

interface UnattributedStorageProps {
  objects: OrphanedObject[];
}

// R2 objects that no manga/chapter/arc/user row's *_url column points at
// any more — leftovers from a re-uploaded avatar, or a cover picked while
// editing and then abandoned by Cancel. Nothing else in the app can ever
// reference these keys again, so deleting them is safe; they're just
// never surfaced anywhere but here.
export default function UnattributedStorage({ objects }: UnattributedStorageProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  if (objects.length === 0) return null;

  const totalBytes = objects.reduce((sum, o) => sum + o.size, 0);

  async function deleteKeys(keys: string[]) {
    const res = await fetch("/api/admin/storage/orphaned", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    });
    if (res.ok) router.refresh();
    return res.ok;
  }

  async function handleDeleteOne(key: string) {
    if (!confirm(`Delete this object? This can't be undone.\n\n${key}`)) return;
    setDeletingKeys((prev) => new Set(prev).add(key));
    const ok = await deleteKeys([key]);
    if (!ok) setDeletingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  async function handleDeleteAll() {
    if (
      !confirm(
        `Delete all ${objects.length} unattributed objects (${formatBytes(totalBytes)})? This can't be undone.`
      )
    )
      return;
    setIsDeletingAll(true);
    const ok = await deleteKeys(objects.map((o) => o.key));
    if (!ok) setIsDeletingAll(false);
  }

  return (
    <div className="border border-border rounded-md bg-surface/60 mb-10">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <div className="text-sm text-fg">
          <span className="font-(family-name:--font-display) text-base">{formatBytes(totalBytes)}</span>{" "}
          <span className="text-fg-secondary">
            unattributed across {objects.length} object{objects.length === 1 ? "" : "s"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-fg-muted transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 flex flex-col gap-3">
          <p className="text-xs text-fg-muted">
            R2 objects no manga, chapter, arc, or user is still linked to — leftovers from re-uploads
            or edits that were cancelled after picking a file. Safe to delete.
          </p>

          <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
            {objects.map((o) => (
              <div
                key={o.key}
                className="flex items-center justify-between gap-3 text-xs bg-bg/40 rounded px-3 py-2"
              >
                <span className="text-fg-secondary truncate font-mono">{o.key}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-fg-muted">{formatBytes(o.size)}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOne(o.key)}
                    disabled={deletingKeys.has(o.key) || isDeletingAll}
                    className="text-danger hover:bg-danger/10 rounded p-1 disabled:opacity-40 transition-colors duration-200"
                    aria-label={`Delete ${o.key}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="self-end text-xs px-3 py-1.5 border border-danger/50 rounded text-danger hover:bg-danger/10 disabled:opacity-50 transition-colors duration-200"
          >
            {isDeletingAll ? "Deleting…" : `Delete all (${formatBytes(totalBytes)})`}
          </button>
        </div>
      )}
    </div>
  );
}
