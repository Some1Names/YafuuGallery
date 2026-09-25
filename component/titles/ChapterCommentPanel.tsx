"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Send, Heart, Flag, Reply } from "lucide-react";
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
  // a moderator-hidden top-level comment kept as a placeholder because it
  // still has visible replies (body is empty then)
  hidden: boolean;
  created_at: string;
  user: CommentUser;
  likeCount: number;
  likedByMe: boolean;
  reportedByMe: boolean;
}

// A top-level comment and its replies (one level deep — see the API).
interface ThreadItem extends CommentItem {
  replies: CommentItem[];
}

// Threads with more replies than this show only the latest
// COLLAPSED_REPLIES_SHOWN until "Show N earlier replies" is clicked.
const COLLAPSE_REPLIES_OVER = 3;
const COLLAPSED_REPLIES_SHOWN = 2;

// Apply `fn` to one comment, wherever it sits — top level or a reply.
function mapComment(
  threads: ThreadItem[] | null,
  id: string,
  fn: (c: CommentItem) => CommentItem
): ThreadItem[] | null {
  return (
    threads?.map((t) =>
      t.id === id
        ? { ...t, ...fn(t) }
        : t.replies.some((r) => r.id === id)
          ? { ...t, replies: t.replies.map((r) => (r.id === id ? fn(r) : r)) }
          : t
    ) ?? threads
  );
}

// created_at of the newest comment in a set of threads, replies included —
// what the reader's "new comments" badge counts from.
function newestCreatedAt(threads: ThreadItem[]): string | null {
  let newest: string | null = null;
  for (const t of threads) {
    for (const c of [t, ...t.replies]) {
      if (newest === null || c.created_at > newest) newest = c.created_at;
    }
  }
  return newest;
}

interface ChapterCommentPanelProps {
  chapterId: string;
  // the reader (null when signed out — the panel never opens for them) —
  // no Report button on their own comments
  currentUserId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentPosted?: () => void;
  // Called with the created_at of the newest comment the reader has now
  // seen (null if there are none) — when the panel loads its comments, and
  // after posting one. The reader's "new comments" badge counts from here.
  onCommentsSeen?: (newestCreatedAt: string | null) => void;
}

const MAX_BODY_LENGTH = 2000;

// Slide-in panel, only ever mounted-open for a signed-in reader —
// ChapterReaderClient routes anyone without an account to /signup before
// this can open, so there's no signed-out state to handle in here.
export default function ChapterCommentPanel({
  chapterId,
  currentUserId,
  isOpen,
  onClose,
  onCommentPosted,
  onCommentsSeen,
}: ChapterCommentPanelProps) {
  const [comments, setComments] = useState<ThreadItem[] | null>(null);
  // Whether the API has older comments beyond what's loaded — it serves
  // the newest page first, older pages on demand ("Show older comments").
  const [hasOlder, setHasOlder] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set while composing a reply: which thread it goes into, and who's being
  // answered (shown above the box, with a cancel).
  const [replyTo, setReplyTo] = useState<{ threadId: string; name: string } | null>(null);
  // Collapsed long threads the reader has opened up.
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(() => new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // What the list's scroll position should do after the next comments
  // update: jump to the bottom (first load, own new comment), keep the
  // reader's place when older comments get prepended above, or bring a
  // just-posted reply into view. Null = leave it alone (e.g. toggling a
  // like shouldn't yank the list anywhere).
  const pendingScrollRef = useRef<
    "bottom" | { prevHeight: number; prevTop: number } | { commentId: string } | null
  >(null);

  // Read through a ref so the fetch effect below doesn't re-run (and
  // refetch) whenever the parent passes a new callback function.
  const onCommentsSeenRef = useRef(onCommentsSeen);
  useEffect(() => {
    onCommentsSeenRef.current = onCommentsSeen;
  });

  // Each opening (or a different chapter while open) starts from a clean
  // loading state. Reset during render, not in the fetch effect below, so
  // the stale list from the last opening is never painted for a frame
  // (React's "adjusting state when a prop changes" pattern).
  const openKey = isOpen ? chapterId : null;
  const [prevOpenKey, setPrevOpenKey] = useState<string | null>(null);
  if (openKey !== prevOpenKey) {
    setPrevOpenKey(openKey);
    if (openKey !== null) {
      setComments(null);
      setHasOlder(false);
      setError(null);
      setReplyTo(null);
      setExpandedThreads(new Set());
    }
  }

  // Refetches fresh every time the panel opens (also covers switching
  // chapters, since ChapterReaderClient closes the panel on that and this
  // effect re-runs the moment it's reopened for the new chapterId).
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetch(`/api/chapters/${chapterId}/comments`)
      .then((res) => res.json())
      .then((data: { comments: ThreadItem[]; hasMore: boolean }) => {
        if (cancelled) return;
        pendingScrollRef.current = "bottom";
        setComments(data.comments);
        setHasOlder(data.hasMore);
        onCommentsSeenRef.current?.(newestCreatedAt(data.comments));
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, chapterId]);

  // Layout effect so the scroll adjustment lands before paint — with a
  // plain effect, prepending older comments would flash the list jumping
  // down and back.
  useLayoutEffect(() => {
    const list = listRef.current;
    const pending = pendingScrollRef.current;
    if (!list || !pending) return;
    pendingScrollRef.current = null;
    if (pending === "bottom") {
      list.scrollTo({ top: list.scrollHeight });
    } else if ("commentId" in pending) {
      document.getElementById(`comment-${pending.commentId}`)?.scrollIntoView({ block: "nearest" });
    } else {
      list.scrollTop = list.scrollHeight - pending.prevHeight + pending.prevTop;
    }
  }, [comments]);

  async function loadOlder() {
    const oldest = comments?.[0];
    if (!oldest || isLoadingOlder) return;
    setIsLoadingOlder(true);
    try {
      const res = await fetch(`/api/chapters/${chapterId}/comments?before=${encodeURIComponent(oldest.id)}`);
      if (!res.ok) throw new Error();
      const data: { comments: ThreadItem[]; hasMore: boolean } = await res.json();
      const list = listRef.current;
      if (list) pendingScrollRef.current = { prevHeight: list.scrollHeight, prevTop: list.scrollTop };
      setComments((prev) => [...data.comments, ...(prev ?? [])]);
      setHasOlder(data.hasMore);
    } catch {
      setError("Couldn't load older comments — please try again.");
    } finally {
      setIsLoadingOlder(false);
    }
  }

  async function submitComment() {
    const body = draft.trim();
    if (!body || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/chapters/${chapterId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, parent_id: replyTo?.threadId ?? null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to post comment.");
        return;
      }

      const created: ThreadItem & { parent_id: string | null } = await res.json();
      const { parent_id: parentId, ...createdItem } = created;
      if (parentId) {
        // a reply: into its thread, which opens up so the reply is visible
        pendingScrollRef.current = { commentId: createdItem.id };
        setComments(
          (prev) =>
            prev?.map((t) => (t.id === parentId ? { ...t, replies: [...t.replies, createdItem] } : t)) ?? prev
        );
        setExpandedThreads((prev) => new Set(prev).add(parentId));
      } else {
        pendingScrollRef.current = "bottom";
        setComments((prev) => [...(prev ?? []), createdItem]);
      }
      setReplyTo(null);
      setDraft("");
      onCommentPosted?.();
      onCommentsSeenRef.current?.(created.created_at);
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

  // Reply uses the one comment box at the bottom. Answering a reply (not
  // the thread's top comment) starts the text with @name, since everything
  // in a thread sits at the same depth and would otherwise lose who's
  // being answered.
  function startReply(thread: ThreadItem, comment: CommentItem) {
    const name = formatUsername(comment.user.name, comment.user.tag);
    setReplyTo({ threadId: thread.id, name });
    if (comment.id !== thread.id) {
      const mention = `@${comment.user.name ?? name} `;
      setDraft((d) => (d.startsWith(mention) ? d : mention + d));
    }
    textareaRef.current?.focus();
  }

  function cancelReply() {
    setReplyTo(null);
    textareaRef.current?.focus();
  }

  // Confirm first (a report is sent to moderators), then mark it reported
  // straight away; on failure, put the button back and say why.
  async function reportComment(comment: CommentItem) {
    if (!confirm("Report this comment to the moderators?")) return;
    setComments((prev) => mapComment(prev, comment.id, (c) => ({ ...c, reportedByMe: true })));
    try {
      const res = await fetch(`/api/comments/${comment.id}/report`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Couldn't report this comment.");
      }
    } catch (err) {
      setComments((prev) => mapComment(prev, comment.id, (c) => ({ ...c, reportedByMe: false })));
      setError(err instanceof Error ? err.message : "Couldn't report this comment.");
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
      mapComment(prev, comment.id, (c) => ({ ...c, likedByMe: optimisticLiked, likeCount: optimisticCount }))
    );

    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data: { liked: boolean; likeCount: number } = await res.json();
      setComments((prev) =>
        mapComment(prev, comment.id, (c) => ({ ...c, likedByMe: data.liked, likeCount: data.likeCount }))
      );
    } catch {
      setComments((prev) =>
        mapComment(prev, comment.id, (c) => ({ ...c, likedByMe: comment.likedByMe, likeCount: comment.likeCount }))
      );
    }
  }

  // One comment's markup — a thread's top comment or a reply (smaller
  // avatar). A hidden top comment renders as a placeholder only.
  function renderComment(c: CommentItem, thread: ThreadItem, isReply: boolean) {
    const avatarSize = isReply ? "w-6 h-6" : "w-8 h-8";
    if (c.hidden) {
      return (
        <div key={c.id} id={`comment-${c.id}`} className="flex gap-2.5">
          <span className={`${avatarSize} rounded-full bg-bg border border-border shrink-0`} />
          <p className="text-sm text-fg-muted italic self-center">This comment was hidden by a moderator.</p>
        </div>
      );
    }
    const author = formatUsername(c.user.name, c.user.tag);
    return (
      <div key={c.id} id={`comment-${c.id}`} className="flex gap-2.5">
        <span
          className={`relative ${avatarSize} rounded-full overflow-hidden bg-bg border border-border flex items-center justify-center shrink-0`}
        >
          {c.user.image ? (
            <Image src={c.user.image} alt={c.user.name ?? "User"} fill sizes="32px" className="object-cover" />
          ) : (
            <span className="text-xs text-fg">{(c.user.name ?? "?").charAt(0).toUpperCase()}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-fg font-medium truncate">{author}</span>
            <span className="text-xs text-fg-muted shrink-0">{timeAgo(new Date(c.created_at))}</span>
          </div>
          <p className="text-sm text-fg-secondary whitespace-pre-wrap break-words mt-0.5">{c.body}</p>
          <div className="flex items-center gap-4 mt-1">
            <button
              type="button"
              onClick={() => toggleLike(c)}
              aria-pressed={c.likedByMe}
              aria-label={c.likedByMe ? "Unlike this comment" : "Like this comment"}
              className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                c.likedByMe ? "text-danger" : "text-fg-muted hover:text-fg-secondary"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${c.likedByMe ? "fill-current" : ""}`} />
              {c.likeCount > 0 && c.likeCount}
            </button>
            <button
              type="button"
              onClick={() => startReply(thread, c)}
              aria-label={`Reply to ${author}`}
              className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg-secondary transition-colors duration-200"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
            {/* Report — only on other people's comments. Stays as a quiet
                "Reported" once sent (one per reader). */}
            {c.user.id !== currentUserId &&
              (c.reportedByMe ? (
                <span className="flex items-center gap-1 text-xs text-fg-muted">
                  <Flag className="w-3.5 h-3.5" />
                  Reported
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => reportComment(c)}
                  aria-label={`Report comment by ${author}`}
                  className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg-secondary transition-colors duration-200"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop — mobile only, closes on tap. Desktop has room to leave
          the reader visible alongside the panel, so no dimming there. */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={onClose} />}

      {/* inert while closed: it's only slid off-screen, so otherwise its
          buttons and comment box stayed in the Tab order (and readable by
          screen readers) while invisible. */}
      <div
        inert={!isOpen}
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
            <>
            {hasOlder && (
              <button
                type="button"
                onClick={loadOlder}
                disabled={isLoadingOlder}
                className="self-center text-xs text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
              >
                {isLoadingOlder ? "Loading…" : "Show older comments"}
              </button>
            )}
            {comments.map((thread) => {
              // long threads show only their latest replies until opened up
              const isCollapsed =
                thread.replies.length > COLLAPSE_REPLIES_OVER && !expandedThreads.has(thread.id);
              const shownReplies = isCollapsed
                ? thread.replies.slice(-COLLAPSED_REPLIES_SHOWN)
                : thread.replies;
              const hiddenCount = thread.replies.length - shownReplies.length;
              return (
                <div key={thread.id} className="flex flex-col gap-3">
                  {renderComment(thread, thread, false)}
                  {thread.replies.length > 0 && (
                    <div className="ml-10 pl-3 border-l border-border flex flex-col gap-3">
                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedThreads((prev) => new Set(prev).add(thread.id))}
                          className="self-start text-xs text-fg-secondary hover:text-fg transition-colors duration-200"
                        >
                          Show {hiddenCount} earlier {hiddenCount === 1 ? "reply" : "replies"}
                        </button>
                      )}
                      {shownReplies.map((reply) => renderComment(reply, thread, true))}
                    </div>
                  )}
                </div>
              );
            })}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-3 shrink-0">
          {error && <p className="text-xs text-danger mb-2">{error}</p>}
          {replyTo && (
            <div className="flex items-center justify-between gap-2 mb-2 text-xs text-fg-secondary">
              <span className="truncate">
                Replying to <span className="text-fg font-medium">{replyTo.name}</span>
              </span>
              <button
                type="button"
                onClick={cancelReply}
                aria-label="Cancel reply"
                className="shrink-0 p-1 text-fg-muted hover:text-fg transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder={
                replyTo
                  ? `Reply to ${replyTo.name}…`
                  : "Add a comment… (Enter to send, Shift+Enter for a new line)"
              }
              rows={3}
              maxLength={MAX_BODY_LENGTH}
              className="flex-1 min-w-0 resize-none bg-bg border border-border rounded px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-fg-secondary transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSubmitting}
              aria-label={replyTo ? "Post reply" : "Post comment"}
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
