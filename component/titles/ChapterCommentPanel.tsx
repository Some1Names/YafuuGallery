"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Send, Heart } from "lucide-react";
import { timeAgo } from "@/lib/time-ago";
import { formatUsername } from "@/lib/format-username";

interface CommentUser {
  id: string;
  name: string | null;
  tag: string | null;
  image: string | null;
}

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  user: CommentUser;
  likeCount: number;
  likedByMe: boolean;
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

  async function submitComment() {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitComment();
  }

  // Enter posts the comment; shift+Enter still inserts a newline like a
  // normal textarea (only plain Enter is intercepted).
  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  }

  // Optimistic toggle, same pattern as MangaFavoriteButton/ChapterFavoriteButton
  // — flip immediately, revert on failure, reconcile with the server's
  // actual count either way (a double-click race resolves to whatever the
  // server ends up with, not just the client's own guess).
  async function toggleLike(comment: CommentItem) {
    const optimisticLiked = !comment.likedByMe;
    const optimisticCount = comment.likeCount + (optimisticLiked ? 1 : -1);

    setComments((prev) =>
      prev?.map((c) => (c.id === comment.id ? { ...c, likedByMe: optimisticLiked, likeCount: optimisticCount } : c)) ??
      prev
    );

    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data: { liked: boolean; likeCount: number } = await res.json();
      setComments((prev) =>
        prev?.map((c) => (c.id === comment.id ? { ...c, likedByMe: data.liked, likeCount: data.likeCount } : c)) ??
        prev
      );
    } catch {
      setComments((prev) =>
        prev?.map((c) => (c.id === comment.id ? { ...c, likedByMe: comment.likedByMe, likeCount: comment.likeCount } : c)) ??
        prev
      );
    }
  }

  return (
    <>
      {/* Backdrop — mobile only, closes on tap. Desktop has room to leave
          the reader visible alongside the panel, so no dimming there. */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={onClose} />}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-surface border-l border-border flex flex-col transition-transform duration-300 motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-fg uppercase tracking-wide">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="p-1.5 text-fg-secondary hover:text-fg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {comments === null ? (
            <p className="text-sm text-fg-muted text-center py-8">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-fg-muted text-center py-8">
              No comments yet — be the first to say something.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <span className="relative w-8 h-8 rounded-full overflow-hidden bg-bg border border-border flex items-center justify-center shrink-0">
                  {c.user.image ? (
                    <Image src={c.user.image} alt={c.user.name ?? "User"} fill sizes="32px" className="object-cover" />
                  ) : (
                    <span className="text-xs text-fg">{(c.user.name ?? "?").charAt(0).toUpperCase()}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-fg font-medium truncate">
                      {formatUsername(c.user.name, c.user.tag)}
                    </span>
                    <span className="text-xs text-fg-muted shrink-0">{timeAgo(new Date(c.created_at))}</span>
                  </div>
                  <p className="text-sm text-fg-secondary whitespace-pre-wrap break-words mt-0.5">{c.body}</p>
                  <button
                    type="button"
                    onClick={() => toggleLike(c)}
                    aria-pressed={c.likedByMe}
                    aria-label={c.likedByMe ? "Unlike this comment" : "Like this comment"}
                    className={`flex items-center gap-1 mt-1 text-xs transition-colors duration-200 ${
                      c.likedByMe ? "text-danger" : "text-fg-muted hover:text-fg-secondary"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.likedByMe ? "fill-current" : ""}`} />
                    {c.likeCount > 0 && c.likeCount}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-3 shrink-0">
          {error && <p className="text-xs text-danger mb-2">{error}</p>}
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Add a comment… (Enter to send, Shift+Enter for a new line)"
              rows={3}
              maxLength={MAX_BODY_LENGTH}
              className="flex-1 min-w-0 resize-none bg-bg border border-border rounded px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-fg-secondary transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSubmitting}
              aria-label="Post comment"
              className="shrink-0 p-2.5 bg-fg text-bg rounded-md hover:bg-fg/85 disabled:opacity-40 transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
