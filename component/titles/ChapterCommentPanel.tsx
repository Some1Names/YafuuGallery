"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { timeAgo } from "@/lib/time-ago";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  user: CommentUser;
}

interface ChapterCommentPanelProps {
  chapterId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentPosted?: () => void;
}

const MAX_BODY_LENGTH = 2000;

// Slide-in panel, only ever mounted-open for a signed-in reader —
// ChapterReaderClient routes anyone without an account to /signup before
// this can open, so there's no signed-out state to handle in here.
export default function ChapterCommentPanel({
  chapterId,
  isOpen,
  onClose,
  onCommentPosted,
}: ChapterCommentPanelProps) {
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Refetches fresh every time the panel opens (also covers switching
  // chapters, since ChapterReaderClient closes the panel on that and this
  // effect re-runs the moment it's reopened for the new chapterId).
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setComments(null);
    setError(null);
    fetch(`/api/chapters/${chapterId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setComments(data);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, chapterId]);

  useEffect(() => {
    if (comments) listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [comments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/chapters/${chapterId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to post comment.");
        return;
      }

      const created: CommentItem = await res.json();
      setComments((prev) => [...(prev ?? []), created]);
      setDraft("");
      onCommentPosted?.();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop — mobile only, closes on tap. Desktop has room to leave
          the reader visible alongside the panel, so no dimming there. */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={onClose} />}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#1b1a1c] border-l border-[#050505] flex flex-col transition-transform duration-300 motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#050505] shrink-0">
          <h2 className="text-sm font-semibold text-[#ece6d8] uppercase tracking-wide">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="p-1.5 text-[#b6b0a2] hover:text-[#ece6d8] transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {comments === null ? (
            <p className="text-sm text-[#6b655e] text-center py-8">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-[#6b655e] text-center py-8">
              No comments yet — be the first to say something.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <span className="relative w-8 h-8 rounded-full overflow-hidden bg-[#0a0a0a] border border-[#050505] flex items-center justify-center shrink-0">
                  {c.user.image ? (
                    <Image src={c.user.image} alt={c.user.name ?? "User"} fill sizes="32px" className="object-cover" />
                  ) : (
                    <span className="text-xs text-[#ece6d8]">{(c.user.name ?? "?").charAt(0).toUpperCase()}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-[#ece6d8] font-medium truncate">{c.user.name ?? "Unknown"}</span>
                    <span className="text-xs text-[#6b655e] shrink-0">{timeAgo(new Date(c.created_at))}</span>
                  </div>
                  <p className="text-sm text-[#b6b0a2] whitespace-pre-wrap break-words mt-0.5">{c.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-[#050505] p-3 shrink-0">
          {error && <p className="text-xs text-[#9c1d25] mb-2">{error}</p>}
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              rows={1}
              maxLength={MAX_BODY_LENGTH}
              className="flex-1 min-w-0 resize-none bg-[#0a0a0a] border border-[#050505] rounded px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#b6b0a2] transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSubmitting}
              aria-label="Post comment"
              className="shrink-0 p-2.5 bg-[#ece6d8] text-[#0a0a0a] rounded-md hover:bg-[#ece6d8]/85 disabled:opacity-40 transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
