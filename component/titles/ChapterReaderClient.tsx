"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import ChapterEndNav, { type ChapterLink } from "./ChapterEndNav";
import { ReaderPageSkeleton } from "@/component/Skeletons";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Columns2, Rows2, ChevronDown, Languages, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChapterDisplayNumbers, formatChapterBadge } from "@/lib/chapter-number";
import type { Language } from "@/lib/language";
import { loginHref } from "@/lib/login-redirect";
import { configurePdfWorker } from "@/lib/pdf-worker";
import ChapterCommentPanel from "./ChapterCommentPanel";
import { useTranslations } from "next-intl";

configurePdfWorker(pdfjs);

// The reader's chosen mode persists across chapters and reloads. Safe to
// read during the first render: this component only ever renders in the
// browser (ChapterReader loads it with ssr: false).
const READING_MODE_KEY = "yfgll_reading_mode";

function readSavedMode(): "vertical" | "horizontal" {
  try {
    return localStorage.getItem(READING_MODE_KEY) === "horizontal" ? "horizontal" : "vertical";
  } catch {
    return "vertical";
  }
}

// How long reading position has to sit still before it's saved — a scroll
// through a chapter shouldn't fire a request for every page it passes.
const PROGRESS_SAVE_DELAY_MS = 1500;

// Per chapter: created_at of the newest comment this reader has seen, for
// the "new comments" badge. A per-browser convenience like recent searches
// — it doesn't sync between devices.
const commentsSeenKey = (chapterId: string) => `yfgll_comments_seen:${chapterId}`;

function readCommentsSeen(chapterId: string): string | null {
  try {
    return localStorage.getItem(commentsSeenKey(chapterId));
  } catch {
    return null;
  }
}

function writeCommentsSeen(chapterId: string, createdAt: string) {
  try {
    localStorage.setItem(commentsSeenKey(chapterId), createdAt);
  } catch {
    // storage unavailable — the badge just won't remember
  }
}

// Shared by every <Page> in the reader. No text/annotation layers (these
// are image scans). `reader-page` (globals.css) replaces react-pdf's inline
// WHITE page background with a dark placeholder: pdf.js keeps each page's
// canvas hidden until it's finished drawing, so on this dark reader every
// page used to flash as a blank white sheet — on opening a chapter, turning
// pages, and swiping. The drawn canvas is opaque and covers the
// placeholder entirely. loading: null drops react-pdf's "Loading page…"
// text inside each page box.
const PAGE_DISPLAY_PROPS = {
  renderAnnotationLayer: false,
  renderTextLayer: false,
  className: "overflow-hidden reader-page",
  loading: null,
} as const;

const SWIPE_THRESHOLD_PX = 50;
// Below this, a completed gesture is a tap (toggle the top bar) rather
// than an intentional-but-too-short drag (which just snaps back to center).
const TAP_MAX_PX = 10;
// Matches the CSS transition duration below (duration-200) — keeps the
// state update that swaps in the new page in sync with when it's actually
// finished sliding fully off/on screen, instead of jumping early.
const DRAG_SETTLE_MS = 200;

// Vertical mode only draws pages within this distance of the screen (as an
// IntersectionObserver rootMargin — 200% = two screen-heights above and
// below). Every page is a full-size canvas, so drawing a whole chapter at
// once cost hundreds of MB and a long wait before the first page on long
// chapters; pages scrolled far away are dropped again to free that memory.
const NEAR_PAGES_MARGIN = "200% 0px";
// Once the reader is this many pages from the end, the next chapter (its
// page and its PDF) starts loading, so moving on is quick.
const PRELOAD_NEXT_WITHIN_PAGES = 3;

// The next chapter's PDF, downloaded near the end of the current one and
// handed straight to the viewer when that chapter opens (by URL). Lives
// out here, not in component state, because moving to another chapter
// remounts this whole component (the page segment is keyed by the chapter
// id), which would throw the download away. Holds at most one file — each
// new preload replaces the last — so memory stays bounded.
const preloadedPdfs = new Map<string, Blob>();

// What <Document> should load for a URL: the preloaded copy if there is one.
function documentSourceFor(url: string | null): string | Blob | null {
  return (url && preloadedPdfs.get(url)) || url;
}

type ReadingMode = "vertical" | "horizontal";

interface ChapterSummary {
  id: string;
  chapter_number: number;
  chapter_is_ex: boolean;
  chapter_name: string;
}

interface ChapterTranslation {
  language: Language;
  url: string;
}

interface ChapterReaderProps {
  translations: ChapterTranslation[];
  currentChapterId: string;
  chapterName: string;
  mangaTitle: string;
  mangaId: string;
  chapters: ChapterSummary[];
  // null for a signed-out visitor — the comment bubble sends them to sign
  // in instead of opening the panel when this is null.
  currentUserId: string | null;
  // Saved page to reopen on (0 = start at the top) — from ReadingProgress.
  resumePage: number;
  // The next chapter's files, preloaded near the end of this one
  nextChapterTranslations: ChapterTranslation[];
}

export default function ChapterReaderClient({
  translations,
  currentChapterId,
  chapterName,
  mangaTitle,
  mangaId,
  chapters,
  currentUserId,
  resumePage,
  nextChapterTranslations,
}: ChapterReaderProps) {
  // tReader, not t: the language list below already maps over translations as `t`
  const tReader = useTranslations("Reader");
  const tLanguage = useTranslations("LanguageName");
  const router = useRouter();
  const displayNumbers = useMemo(() => getChapterDisplayNumbers(chapters), [chapters]);
  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const currentIsEx = currentChapter?.chapter_is_ex ?? false;
  // Mobile swipe past the first/last page continues into the neighboring
  // chapter (matching MangaPlus) instead of wrapping back within this one —
  // chapters is already in the same reading order the selector dropdown
  // below displays it in.
  const currentChapterIdx = chapters.findIndex((c) => c.id === currentChapterId);
  const nextChapter = chapters[currentChapterIdx + 1];
  const prevChapter = chapters[currentChapterIdx - 1];
  const currentDisplayNumber = displayNumbers.get(currentChapterId);
  const chapterLabel = tReader("chapterLabel", { number: currentIsEx ? "ex" : (currentDisplayNumber ?? 0), name: chapterName });
  const [mode, setMode] = useState<ReadingMode>(readSavedMode);

  // Which language is currently showing. Falls back to the chapter's first
  // available translation whenever the picked one isn't actually in this
  // chapter's list — e.g. right after navigating to a different chapter
  // (via the chapter selector below) that doesn't have the language that
  // was selected on the previous one, since this component's state
  // persists across that navigation rather than remounting.
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(translations[0]?.language ?? null);
  const activeLanguage = translations.some((t) => t.language === selectedLanguage)
    ? selectedLanguage
    : (translations[0]?.language ?? null);
  const pdfUrl = translations.find((t) => t.language === activeLanguage)?.url ?? null;

  // language-selector dropdown
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);

  // Closes on an outside click or Escape (focus back to the toggle, so a
  // keyboard user isn't dropped at the top of the page).
  useEffect(() => {
    if (!isLanguageMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLanguageMenuOpen(false);
        languageButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isLanguageMenuOpen]);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState(760);

  const [pageRatios, setPageRatios] = useState<Record<number, number>>({});
  const [readerHeight, setReaderHeight] = useState(760);
  const [viewportWidth, setViewportWidth] = useState(1200);

  const isFullscreen = mode === "horizontal";
  // Below Tailwind's sm breakpoint, a landscape-paired two-page spread
  // leaves each page too narrow to read — horizontal mode shows one page
  // at a time there instead, same threshold used everywhere else in the
  // app for mobile vs desktop layout.
  const isMobile = viewportWidth < 640;

  // top bar auto-hides in fullscreen mode unless the mouse is near the
  // top edge of the screen — vertical mode always shows it. Opening
  // straight into fullscreen (saved mode) starts it hidden.
  const [topBarVisible, setTopBarVisible] = useState(!isFullscreen);

  // Comment panel — signed-out visitors never see it open at all (the
  // bubble button sends them to /signup instead), so no signed-out UI
  // exists inside ChapterCommentPanel itself.
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);

  // The badge shows NEW comments only — visible comments posted since the
  // newest one this reader has already seen on this chapter (kept per
  // chapter in localStorage, as that comment's server-side created_at, so
  // a wrong device clock can't skew it), excluding their own. No badge =
  // nothing new. Tagged with the chapter it was fetched for, so a slow
  // response for the previous chapter can't show on this one.
  const [unread, setUnread] = useState<{ chapterId: string; count: number } | null>(null);
  const unreadCount = unread?.chapterId === currentChapterId ? unread.count : 0;

  useEffect(() => {
    let cancelled = false;
    const since = readCommentsSeen(currentChapterId);
    fetch(`/api/chapters/${currentChapterId}/comments/unread${since ? `?since=${encodeURIComponent(since)}` : ""}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count: number } | null) => {
        if (!cancelled && data) setUnread({ chapterId: currentChapterId, count: data.count });
      })
      .catch(() => {
        // no badge is the safe fallback
      });
    return () => {
      cancelled = true;
    };
  }, [currentChapterId]);

  // From the comment panel: the reader has now seen everything up to this
  // comment (on opening the panel, or after posting their own).
  function handleCommentsSeen(newestCreatedAt: string | null) {
    if (newestCreatedAt) writeCommentsSeen(currentChapterId, newestCreatedAt);
    setUnread({ chapterId: currentChapterId, count: 0 });
  }

  function handleCommentButtonClick() {
    if (!currentUserId) {
      // sign in, then land straight back on this chapter
      router.push(loginHref(`/viewer/${currentChapterId}`));
      return;
    }
    setIsCommentPanelOpen((v) => !v);
  }

  // Moving to another chapter closes the panel. Adjusted during render
  // (React's "adjusting state when a prop changes" pattern) instead of in
  // an effect, which would paint one frame of the old panel first — the
  // same pattern is used for the page reset and top bar below.
  const [panelChapterId, setPanelChapterId] = useState(currentChapterId);
  if (currentChapterId !== panelChapterId) {
    setPanelChapterId(currentChapterId);
    setIsCommentPanelOpen(false);
  }

  // chapter-selector dropdown
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const chapterMenuRef = useRef<HTMLDivElement>(null);
  const chapterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isChapterMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (chapterMenuRef.current && !chapterMenuRef.current.contains(e.target as Node)) {
        setIsChapterMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsChapterMenuOpen(false);
        chapterButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isChapterMenuOpen]);

  // The single source of truth for reading position, shared by both modes,
  // so switching modes lands on the same page instead of jumping back to
  // the start. Horizontal mode's spreadIdx is derived from it below;
  // vertical mode's scroll position is synced to/from it via pageRefs.
  const [currentPage, setCurrentPage] = useState(1);

  // Vertical mode's page wrapper divs, keyed by page number — used to jump
  // the scroll position to currentPage when entering vertical mode, and to
  // read the currently-scrolled-to page when leaving it.
  const pageRefs = useRef(new Map<number, HTMLDivElement>());

  // Latest props/mode for onDocumentLoadSuccess, which is created once and
  // would otherwise see stale values after navigating between chapters
  // (this component persists across that navigation). Synced after every
  // render further down.
  const latestRef = useRef({ chapterId: currentChapterId, resumePage, mode: "vertical" as ReadingMode });
  // Which chapter's saved position has been restored — progress saving
  // waits for this, or the page-1 state a PDF opens on could be saved over
  // the reader's real position before the resume below gets to run.
  const restoredChapterRef = useRef<string | null>(null);

  const onDocumentLoadSuccess = useCallback(async (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);

    const entries = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (n) => {
        const page = await pdf.getPage(n);
        const { width, height } = page.getViewport({ scale: 1 });
        return [n, width / height] as const;
      })
    );
    setPageRatios(Object.fromEntries(entries));

    // Resume where this reader left off, once per chapter (not again on a
    // language switch, which reloads the document). Only possible now that
    // pageRatios are known: vertical mode's page wrappers get their real
    // heights from them, so scrolling to one lands in the right place.
    const { chapterId, resumePage: savedPage, mode: currentMode } = latestRef.current;
    if (restoredChapterRef.current !== chapterId) {
      if (savedPage > 1) {
        const page = Math.min(savedPage, pdf.numPages);
        setCurrentPage(page);
        if (currentMode === "vertical") {
          // two frames: let React commit the sized wrappers first
          requestAnimationFrame(() =>
            requestAnimationFrame(() => pageRefs.current.get(page)?.scrollIntoView({ block: "start" }))
          );
        }
      }
      restoredChapterRef.current = chapterId;
    }
  }, []);

  const spreads = useMemo(() => {
    if (isMobile) {
      return Array.from({ length: numPages }, (_, i) => [i + 1]);
    }

    const isLandscape = (n: number) => (pageRatios[n] ?? 0) > 1;
    const result: number[][] = [];
    let i = 1;
    while (i <= numPages) {
      if (isLandscape(i)) {
        result.push([i]);
        i += 1;
        continue;
      }
      const next = i + 1;
      if (next <= numPages && !isLandscape(next)) {
        result.push([i, next]);
        i += 2;
      } else {
        result.push([i]);
        i += 1;
      }
    }
    return result;
  }, [numPages, pageRatios, isMobile]);

  const currentPageRef = useRef(1);
  // Mirrored every render (no dependency array — meant to stay
  // unconditionally in sync) so the scroll-restore effect below can read
  // the latest value without listing it as an effect dependency, which
  // would re-run it on every scroll-tracked page change instead of only on
  // an actual mode switch.
  useEffect(() => {
    currentPageRef.current = currentPage;
    latestRef.current = { chapterId: currentChapterId, resumePage, mode };
  });

  const spreadIdx = useMemo(() => {
    const idx = spreads.findIndex((s) => s.includes(currentPage));
    return idx >= 0 ? idx : 0;
  }, [spreads, currentPage]);
  const currentSpread = spreads[spreadIdx] ?? [];

  // Past the last spread, "next" continues into the next chapter (and past
  // the first, "previous" into the previous one) — same as mobile swipe
  // already did; desktop used to just stop dead at the chapter's edges.
  const isLastSpread = spreadIdx >= spreads.length - 1;
  const isFirstSpread = spreadIdx === 0;

  const nextChapterId = nextChapter?.id;
  const prevChapterId = prevChapter?.id;

  const goNext = useCallback(() => {
    if (spreadIdx >= spreads.length - 1) {
      if (nextChapterId) router.push(`/viewer/${nextChapterId}`);
      return;
    }
    const next = spreads[spreadIdx + 1];
    if (next?.[0] !== undefined) setCurrentPage(next[0]);
  }, [spreads, spreadIdx, nextChapterId, router]);

  const goPrev = useCallback(() => {
    if (spreadIdx === 0) {
      if (prevChapterId) router.push(`/viewer/${prevChapterId}`);
      return;
    }
    const prev = spreads[spreadIdx - 1];
    if (prev?.[0] !== undefined) setCurrentPage(prev[0]);
  }, [spreads, spreadIdx, prevChapterId, router]);

  // Finds whichever page is nearest the viewport's vertical center in
  // vertical mode's scrolled list — used to capture reading position right
  // before switching into horizontal mode.
  const findCurrentPageInVerticalView = useCallback((): number => {
    const viewportCenter = window.innerHeight / 2;
    let closest = currentPageRef.current;
    let closestDist = Infinity;
    pageRefs.current.forEach((el, n) => {
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = n;
      }
    });
    return closest;
  }, []);

  // Vertical mode: which pages are close enough to the screen to draw (see
  // NEAR_PAGES_MARGIN). Only starts once every page's size is known — the
  // wrappers are sized from pageRatios, and before that they're all zero
  // height, so every page would count as "near" and get drawn at once.
  const [nearPages, setNearPages] = useState<Set<number>>(() => new Set());
  const ratiosReady = numPages > 0 && Object.keys(pageRatios).length === numPages;

  useEffect(() => {
    if (mode !== "vertical" || !ratiosReady) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setNearPages((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const n = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting) next.add(n);
            else next.delete(n);
          }
          return next;
        });
      },
      { rootMargin: NEAR_PAGES_MARGIN }
    );
    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // pdfUrl: a new document mounts new wrapper elements to observe
  }, [mode, ratiosReady, numPages, pdfUrl]);

  // Vertical mode used to only work out the current page at the moment of
  // switching to horizontal. It's now tracked while scrolling, so reading
  // progress can be saved from either mode. rAF-throttled: one update per
  // frame at most, not one per scroll event.
  useEffect(() => {
    if (mode !== "vertical" || numPages === 0) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setCurrentPage(findCurrentPageInVerticalView());
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode, numPages, findCurrentPageInVerticalView]);

  // Save reading progress (signed-in readers only) once the position has
  // settled for PROGRESS_SAVE_DELAY_MS, so reopening this chapter resumes
  // here. "Completed" = the spread holding the last page was reached, which
  // lets the manga page's Continue button move on to the next chapter.
  // A save still pending when the reader leaves (another chapter, or the
  // page itself) is sent right away with keepalive rather than dropped.
  const pendingProgressRef = useRef<{ chapterId: string; page: number; completed: boolean } | null>(null);

  const flushProgress = useCallback(() => {
    const pending = pendingProgressRef.current;
    if (!pending) return;
    pendingProgressRef.current = null;
    fetch(`/api/chapters/${pending.chapterId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pending.page, completed: pending.completed }),
      keepalive: true,
    }).catch(() => {
      // best-effort — a missed save just means resuming a little earlier
    });
  }, []);

  const lastPageInView = currentSpread.length > 0 ? Math.max(...currentSpread) : currentPage;

  // Near the end: start loading the next chapter — its route (router
  // prefetch) and its PDF in the same language. The PDF is kept in memory
  // as a Blob (preloadedPdfs, above) and handed straight to the viewer when
  // that chapter opens: relying on the browser's HTTP cache doesn't work,
  // since browsers won't cache a file this size (a 24 MB chapter was
  // re-downloaded in full even with cache: "force-cache"). A Blob rather
  // than an ArrayBuffer because react-pdf reads a fresh copy out of a Blob
  // on every load, while an ArrayBuffer gets handed off to the pdf.js
  // worker and can't be used twice. Once per chapter, and skipped when the
  // reader has asked to save data.
  const nextPdfUrl =
    nextChapterTranslations.find((t) => t.language === activeLanguage)?.url ??
    nextChapterTranslations[0]?.url ??
    null;
  const isNearEnd = numPages > 0 && lastPageInView >= numPages - PRELOAD_NEXT_WITHIN_PAGES;
  const preloadedChapterRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isNearEnd || !nextChapterId || preloadedChapterRef.current === nextChapterId) return;
    preloadedChapterRef.current = nextChapterId;
    router.prefetch(`/viewer/${nextChapterId}`);
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!nextPdfUrl || saveData) return;
    fetch(nextPdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        preloadedPdfs.clear();
        preloadedPdfs.set(nextPdfUrl, blob);
      })
      .catch(() => {
        // best-effort — the next chapter just downloads when opened
      });
  }, [isNearEnd, nextChapterId, nextPdfUrl, router]);

  useEffect(() => {
    if (!currentUserId || numPages === 0) return;
    // don't save until this chapter's saved position has been restored
    if (restoredChapterRef.current !== currentChapterId) return;
    pendingProgressRef.current = {
      chapterId: currentChapterId,
      page: currentPage,
      completed: lastPageInView >= numPages,
    };
    const timer = window.setTimeout(flushProgress, PROGRESS_SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [currentUserId, currentChapterId, currentPage, lastPageInView, numPages, flushProgress]);

  // Leaving: another chapter (currentChapterId changes) or the page
  // (unmount / tab hidden) — send whatever's pending instead of losing it.
  useEffect(() => {
    const onPageHide = () => flushProgress();
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      flushProgress();
    };
  }, [currentChapterId, flushProgress]);

  function switchMode(next: ReadingMode) {
    if (mode === "vertical" && next === "horizontal") {
      setCurrentPage(findCurrentPageInVerticalView());
    }
    setMode(next);
    try {
      localStorage.setItem(READING_MODE_KEY, next);
    } catch {
      // storage unavailable (private browsing) — the mode just won't persist
    }
  }

  // Mobile horizontal mode turns pages by swipe instead of the left/right
  // tap zones desktop uses (those stay click-based, mouse-only, and are
  // deliberately NOT flipped to match — this mirrors the physical book
  // metaphor below, tap zones are a separate, arbitrary UI convention).
  // RTL: a left-to-right swipe (positive delta) advances forward, a
  // right-to-left swipe goes back — the opposite of an LTR/Western comic,
  // matching how a physical RTL book mirrors an LTR one (the page being
  // read sits on the left, not the right, so advancing flips it
  // left-to-right). dragOffsetPx tracks the finger 1:1 in real time (via
  // handleSwipeMove, read in the render below to slide the current — and,
  // while dragging, the adjacent — page) so a swipe visually behaves like
  // turning a physical page instead of just teleporting once the finger
  // lifts. dragTransitionEnabled is off during the live drag itself (no lag
  // behind the finger) and on only for the snap-to-settled-position
  // animation once it does.
  const swipeStartXRef = useRef(0);
  const isSwipingRef = useRef(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [dragTransitionEnabled, setDragTransitionEnabled] = useState(false);

  function handleSwipeStart(e: React.PointerEvent<HTMLDivElement>) {
    swipeStartXRef.current = e.clientX;
    isSwipingRef.current = true;
    setDragTransitionEnabled(false);
    setDragOffsetPx(0);
  }

  function handleSwipeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isSwipingRef.current) return;
    setDragOffsetPx(e.clientX - swipeStartXRef.current);
  }

  // Slides the current page the rest of the way off-screen (or, if the
  // drag didn't clear the threshold, back to center) before actually
  // advancing — deferring the page-swap state update until that animation
  // finishes is what keeps it from visibly "jumping" mid-slide.
  function settleDrag(targetPx: number, advance?: () => void) {
    setDragTransitionEnabled(true);
    setDragOffsetPx(targetPx);
    if (!advance) return;
    window.setTimeout(() => {
      setDragTransitionEnabled(false);
      advance();
      setDragOffsetPx(0);
    }, DRAG_SETTLE_MS);
  }

  function handleSwipeEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    const delta = e.clientX - swipeStartXRef.current;

    // Anything under TAP_MAX_PX is a tap, not a page turn — the top bar's
    // own reveal mechanism (mouse-near-top-edge) has no touch equivalent,
    // so a tap toggles it instead.
    if (Math.abs(delta) <= TAP_MAX_PX) {
      settleDrag(0);
      setTopBarVisible((v) => !v);
      return;
    }

    if (delta > SWIPE_THRESHOLD_PX) {
      // Physical RTL books mirror LTR ones: the page being read sits on the
      // left (not the right), so advancing flips it left-to-right — a
      // left-to-right (positive-delta) drag is "next" here, the opposite of
      // an LTR/Western comic's right-to-left "next" swipe.
      const next = spreads[spreadIdx + 1];
      if (next?.[0] !== undefined) {
        settleDrag(viewportWidth, () => setCurrentPage(next[0]));
      } else if (nextChapter) {
        // Last page of this chapter — continue into the next chapter's
        // first page (matching MangaPlus) instead of looping back to this
        // chapter's own first page. Its pages aren't loaded here, so there's
        // no peek to slide in — just this page sliding away before the
        // navigation lands.
        settleDrag(viewportWidth, () => router.push(`/viewer/${nextChapter.id}`));
      } else {
        settleDrag(0);
      }
    } else if (delta < -SWIPE_THRESHOLD_PX) {
      const prev = spreads[spreadIdx - 1];
      if (prev?.[0] !== undefined) {
        settleDrag(-viewportWidth, () => setCurrentPage(prev[0]));
      } else if (prevChapter) {
        settleDrag(-viewportWidth, () => router.push(`/viewer/${prevChapter.id}`));
      } else {
        settleDrag(0);
      }
    } else {
      // Below the threshold — spring back to center instead of turning
      // the page.
      settleDrag(0);
    }
  }

  function handleSwipeCancel() {
    isSwipingRef.current = false;
    settleDrag(0);
  }

  // A different file (another chapter, or a language switch) starts on
  // page 1; onDocumentLoadSuccess then resumes the saved page if there is
  // one, once the new document has loaded.
  // What <Document> loads: normally the PDF's URL, or the Blob already
  // downloaded when this chapter was preloaded near the end of the last one.
  const [docFile, setDocFile] = useState(() => documentSourceFor(pdfUrl));
  const [pagePdfUrl, setPagePdfUrl] = useState(pdfUrl);
  if (pdfUrl !== pagePdfUrl) {
    setPagePdfUrl(pdfUrl);
    setCurrentPage(1);
    setNearPages(new Set());
    setDocFile(documentSourceFor(pdfUrl));
  }

  useEffect(() => {
    if (mode !== "horizontal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Jump vertical mode's scroll position to match wherever horizontal mode
  // (or a fresh chapter load) left off. Declared after the body-overflow
  // effect above so it runs after that effect has cleared "overflow:
  // hidden" back to "" for this render — scrollIntoView is a no-op while
  // that's still set. This only works correctly because each page wrapper
  // div below is given an explicit height from the already-loaded
  // pageRatios, so its layout is correct the instant it mounts rather than
  // waiting on react-pdf's own async canvas render — otherwise this would
  // scroll against a small loading-placeholder height and land nowhere
  // close to right.
  useEffect(() => {
    if (mode !== "vertical") return;
    pageRefs.current.get(currentPageRef.current)?.scrollIntoView({ block: "start" });
  }, [mode]);

  // top bar visibility follows the mouse only in fullscreen mode: shown
  // outside it, and hidden on entering it until the mouse moves up
  const [barFullscreen, setBarFullscreen] = useState(isFullscreen);
  if (isFullscreen !== barFullscreen) {
    setBarFullscreen(isFullscreen);
    setTopBarVisible(!isFullscreen);
  }
  useEffect(() => {
    if (!isFullscreen) return;
    const onMove = (e: MouseEvent) => {
      setTopBarVisible(e.clientY < 96);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isFullscreen]);

  useEffect(() => {
    const update = () => {
      setPageWidth(Math.min(window.innerWidth - 48, 760));
      setViewportWidth(window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const update = () => setReaderHeight(Math.max(window.innerHeight - 32, 400));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fallbackWidth = isMobile
    ? viewportWidth - 32
    : isFullscreen
      ? Math.min(viewportWidth * 0.42, 480)
      : Math.min((pageWidth - 12) / 2, 420);

  function pageSizeProps(pageNum: number) {
    const ratio = pageRatios[pageNum];
    const maxWidth = isFullscreen ? viewportWidth - 32 : pageWidth;
    if (ratio === undefined) return { width: fallbackWidth };

    // A landscape/double-page-spread page needs to fit within BOTH the
    // available width and height, whichever is the tighter constraint —
    // sizing by width alone (as if every landscape page were wide enough
    // to be width-bound) can render one taller than the screen and clip it
    // top and bottom. Mobile applies the same fit-both check to every page,
    // portrait included, since there's no spare width there to fall back on
    // the way desktop's wider viewport has.
    if (isMobile || ratio > 1) {
      const widthConstrainedHeight = maxWidth / ratio;
      return widthConstrainedHeight <= readerHeight ? { width: maxWidth } : { height: readerHeight };
    }

    return { height: readerHeight };
  }

  // Mobile drag feedback: while actively dragging, the adjacent spread in
  // the drag's direction slides into view alongside the current one — both
  // driven by the same dragOffsetPx so they move together as one gesture.
  // Undefined past either end (no peek to show) rather than wrapping or
  // clamping — dragging past the last/first page continues into the next/
  // previous chapter, whose pages aren't loaded here to preview.
  const peekDirection = dragOffsetPx > 0 ? 1 : dragOffsetPx < 0 ? -1 : 0;
  const peekSpread = peekDirection !== 0 ? spreads[spreadIdx + peekDirection] : undefined;
  const showPeek = peekDirection !== 0 && peekSpread !== undefined;
  // Negated peekDirection: the "next" peek (direction 1) starts parked at
  // -viewportWidth (off-screen left) and slides toward 0 as dragOffsetPx
  // grows positive — the mirror image of an LTR carousel, where advancing
  // content enters from the right instead.
  const peekOffsetPx = -peekDirection * viewportWidth + dragOffsetPx;

  const chapterLink = (c: ChapterSummary | undefined): ChapterLink | undefined =>
    c && {
      href: `/viewer/${c.id}`,
      badge: formatChapterBadge(c.chapter_is_ex, displayNumbers.get(c.id)),
      name: c.chapter_name,
    };
  const prevChapterLink = chapterLink(prevChapter);
  const nextChapterLink = chapterLink(nextChapter);

  const pageCounterText =
    numPages > 0 && currentSpread.length > 0
      ? currentSpread.length === 2
        ? `${Math.min(...currentSpread)}-${Math.max(...currentSpread)} / ${numPages}`
        : `${currentSpread[0]} / ${numPages}`
      : "—";

  return (
    <div
      className={`bg-[#0a0a0a] text-[#ece6d8] ${
        isFullscreen ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Top bar — sticky (vertical) vs overlay that auto-hides (horizontal) */}
      <div
        className={`${isFullscreen ? "absolute top-0 left-0 right-0" : "sticky top-0"} z-20 bg-linear-to-b from-[#0a0a0a]/90 to-transparent backdrop-blur-sm border-b-2 transition-transform duration-300 ${
          isFullscreen ? "border-transparent" : "border-[#050505]"
        } ${isFullscreen && !topBarVisible ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* Phones get tighter padding/gaps, a single mode button and the
            page counter moved to the bottom (below) — with everything at
            desktop size, the bar ran past a 320-375px screen's edge once
            the language picker or horizontal mode's counter was showing. */}
        <div className="mx-auto px-4 sm:px-6 md:px-32 h-20 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex gap-3 sm:gap-5 items-center min-w-0 flex-1">
            {/* 40x40 hit area — the bare "‹" alone was 9px wide */}
            <Link
              href={`/manga/titles/${mangaId}`}
              aria-label={tReader("backToManga")}
              className="-ml-2.5 w-10 h-10 inline-flex items-center justify-center text-2xl text-[#ece6d8] hover:text-[#b6b0a2] transition-colors duration-200 shrink-0"
            >
              <span aria-hidden="true">‹</span>
            </Link>
            <div className="hidden sm:block text-lg uppercase text-[#ece6d8] tracking-wide shrink-0">
              {mangaTitle}
            </div>

            {/* Chapter selector — real chapter number, dropdown lists every
                chapter in this manga */}
            <div className="relative shrink-0" ref={chapterMenuRef}>
              <button
                ref={chapterButtonRef}
                type="button"
                onClick={() => setIsChapterMenuOpen((v) => !v)}
                aria-expanded={isChapterMenuOpen}
                aria-label={tReader("chooseChapter", { badge: formatChapterBadge(currentIsEx, currentDisplayNumber) })}
                className="flex gap-1.5 px-2.5 py-1.5 border border-[#050505] rounded text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200"
              >
                <span className="text-sm font-bold">
                  {formatChapterBadge(currentIsEx, currentDisplayNumber)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#b6b0a2] transition-transform duration-200 ${
                    isChapterMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* A plain list of chapter links (aria-current on this one),
                  not role="listbox", whose children would have to be
                  arrow-key-navigable options rather than links. */}
              {isChapterMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg z-30"
                >
                  {chapters.map((c) => (
                    <Link
                      key={c.id}
                      href={`/viewer/${c.id}`}
                      aria-current={c.id === currentChapterId ? "page" : undefined}
                      onClick={() => setIsChapterMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#232224] transition-colors duration-200 ${
                        c.id === currentChapterId ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2]"
                      }`}
                    >
                      <span className="shrink-0">
                        {formatChapterBadge(c.chapter_is_ex, displayNumbers.get(c.id))}
                      </span>
                      <span className="truncate">{c.chapter_name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block text-sm text-[#b6b0a2] truncate min-w-0">{chapterLabel}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {mode === "horizontal" && (
              <span className="hidden sm:inline text-sm text-[#b6b0a2] px-2.5 py-1.5 border border-[#050505] rounded bg-[#0a0a0a]/60">
                {pageCounterText}
              </span>
            )}

            {/* Comments — signed-out visitors get sent to sign in instead
                of the panel opening (handleCommentButtonClick). The badge
                is the NEW-comment count only (see `unread` above). */}
            <button
              type="button"
              onClick={handleCommentButtonClick}
              aria-label={unreadCount > 0 ? tReader("commentsNew", { count: unreadCount }) : tReader("comments")}
              title={tReader("comments")}
              className="relative inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
            >
              <MessageCircle className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#ece6d8] text-[#0a0a0a] text-[10px] font-semibold leading-4 text-center"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Language selector — only shown once a chapter actually has
                more than one translation to switch between; with 0 or 1
                there's nothing to pick, so the icon isn't rendered at all
                rather than sitting there doing nothing. */}
            {/* Shown on phones too — it used to be desktop-only (hidden
                sm:block), leaving phone readers stuck on a chapter's first
                language with no way to switch. */}
            {translations.length > 1 && (
              <div className="relative" ref={languageMenuRef}>
                <button
                  ref={languageButtonRef}
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((v) => !v)}
                  aria-expanded={isLanguageMenuOpen}
                  aria-label={tReader("changeLanguage")}
                  title={tReader("language")}
                  className="inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
                >
                  <Languages className="w-4 h-4" />
                </button>

                {/* A plain list of buttons (aria-pressed on the current
                    one), not role="listbox" — that promises arrow-key
                    option navigation this doesn't implement. */}
                {isLanguageMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-36 bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg z-30"
                  >
                    {translations.map((t) => (
                      <button
                        key={t.language}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(t.language);
                          setIsLanguageMenuOpen(false);
                        }}
                        aria-pressed={t.language === activeLanguage}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#232224] transition-colors duration-200 ${
                          t.language === activeLanguage ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2]"
                        }`}
                      >
                        {tLanguage(t.language)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mode toggle. Phones: one button that switches to the other
                mode (showing that mode's icon), to save room in the bar. */}
            <button
              type="button"
              onClick={() => switchMode(mode === "vertical" ? "horizontal" : "vertical")}
              aria-label={mode === "vertical" ? tReader("toHorizontal") : tReader("toVertical")}
              title={mode === "vertical" ? tReader("horizontal") : tReader("vertical")}
              className="sm:hidden inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
            >
              {mode === "vertical" ? <Columns2 className="w-4 h-4" /> : <Rows2 className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex border border-[#050505] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => switchMode("vertical")}
                aria-pressed={mode === "vertical"}
                aria-label={tReader("verticalMode")}
                title={tReader("vertical")}
                className={`px-3 py-2 transition-colors ${
                  mode === "vertical"
                    ? "bg-[#ece6d8] text-[#0a0a0a]"
                    : "bg-[#1b1a1c] text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8]"
                }`}
              >
                <Rows2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => switchMode("horizontal")}
                aria-pressed={mode === "horizontal"}
                aria-label={tReader("horizontalMode")}
                title={tReader("horizontal")}
                className={`px-3 py-2 transition-colors border-l border-[#050505] ${
                  mode === "horizontal"
                    ? "bg-[#ece6d8] text-[#0a0a0a]"
                    : "bg-[#1b1a1c] text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8]"
                }`}
              >
                <Columns2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phones, horizontal mode: the page counter as a pill at the bottom
          (no room for it in the top bar), shown and hidden with the bar. */}
      {mode === "horizontal" && (
        <div
          aria-hidden={!topBarVisible}
          className={`sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#050505] text-xs text-[#b6b0a2] tabular-nums pointer-events-none transition-opacity duration-300 ${
            topBarVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {pageCounterText}
        </div>
      )}

      {/* Horizontal mode, last page: previous/next chapter float over it
          (paging past the end still goes on to the next chapter too) */}
      {mode === "horizontal" && numPages > 0 && spreads.length > 0 && isLastSpread && (prevChapter || nextChapter) && (
        <ChapterEndNav variant="bar" prev={prevChapterLink} next={nextChapterLink} />
      )}

      {/* Reader */}
      <div
        className={
          isFullscreen
            ? "h-screen w-screen flex items-stretch justify-center"
            : "max-w-225 mx-auto px-4 py-8"
        }
      >
        {!pdfUrl ? (
          <div className="text-center text-[#b6b0a2] py-20">
            {tReader("notUploaded")}
          </div>
        ) : (
        <Document
          key={pdfUrl}
          file={docFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<ReaderPageSkeleton />}
          error={<div className="text-center text-[#b6b0a2] py-20">{tReader("loadFailed")}</div>}
        >
          {mode === "vertical" ? (
            <div className="flex flex-col items-center">
              {Array.from({ length: numPages }, (_, i) => {
                const n = i + 1;
                return (
                  <div
                    key={n}
                    data-page={n}
                    // Same dark placeholder as a page that's still drawing
                    // (.reader-page), for pages not drawn right now.
                    className="bg-[#161616]"
                    ref={(el) => {
                      if (el) pageRefs.current.set(n, el);
                      else pageRefs.current.delete(n);
                    }}
                    // Sized upfront from the already-loaded pageRatios so
                    // this wrapper has the right layout height the instant
                    // it mounts, instead of collapsing to a small
                    // loading-placeholder height until react-pdf's own
                    // async canvas render catches up — the scroll-restore
                    // effect above depends on this being correct immediately.
                    style={pageRatios[n] ? { height: pageWidth / pageRatios[n] } : undefined}
                  >
                    {pageRatios[n] && nearPages.has(n) && (
                      <Page
                        pageNumber={n}
                        width={pageWidth}
                        {...PAGE_DISPLAY_PROPS}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            isMobile ? (
              <div
                // w-screen, not w-full: every visible child here is
                // position:absolute (needed for the drag transform), which
                // takes them out of normal flow entirely — with nothing
                // left in-flow to size around, a flex item sized by content
                // (the default, main-axis behavior) collapses to zero width.
                // h-full still works because the ancestor row-flex uses
                // items-stretch, which fills the cross axis unconditionally
                // regardless of content.
                className="relative flex justify-center items-center w-screen h-full touch-pan-y overflow-hidden"
                onPointerDown={handleSwipeStart}
                onPointerMove={handleSwipeMove}
                onPointerUp={handleSwipeEnd}
                onPointerCancel={handleSwipeCancel}
              >
                {/* The adjacent page, only mounted while a drag has moved far
                    enough to reveal it — positioned one viewport-width off in
                    the drag's direction, sliding in as dragOffsetPx grows. */}
                {showPeek && peekSpread?.[0] !== undefined && (
                  <div
                    className={`absolute inset-0 flex justify-center items-center ${
                      dragTransitionEnabled ? "transition-transform duration-200 ease-out" : ""
                    }`}
                    style={{ transform: `translateX(${peekOffsetPx}px)` }}
                  >
                    <Page
                      pageNumber={peekSpread[0]}
                      {...pageSizeProps(peekSpread[0])}
                      {...PAGE_DISPLAY_PROPS}
                    />
                  </div>
                )}
                {currentSpread[0] !== undefined && (
                  <div
                    className={`absolute inset-0 flex justify-center items-center ${
                      dragTransitionEnabled ? "transition-transform duration-200 ease-out" : ""
                    }`}
                    style={{ transform: `translateX(${dragOffsetPx}px)` }}
                  >
                    <Page
                      pageNumber={currentSpread[0]}
                      {...pageSizeProps(currentSpread[0])}
                      {...PAGE_DISPLAY_PROPS}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative flex justify-center items-center w-full h-full">
                {/* RTL: currentSpread[0] is read first → renders on the right.
                    currentSpread[1] (if present) is read second → renders on the left. */}
                {currentSpread.length === 2 && (
                  <Page
                    pageNumber={currentSpread[1]}
                    {...pageSizeProps(currentSpread[1])}
                    {...PAGE_DISPLAY_PROPS}
                  />
                )}
                {currentSpread[0] !== undefined && (
                  <Page
                    pageNumber={currentSpread[0]}
                    {...pageSizeProps(currentSpread[0])}
                    {...PAGE_DISPLAY_PROPS}
                  />
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={isLastSpread && !nextChapter}
                  aria-label={isLastSpread ? tReader("nextChapter") : tReader("nextPage")}
                  className="group absolute left-0 top-0 h-full w-1/2 flex items-center justify-start pl-4 disabled:cursor-default cursor-pointer"
                >
                  <span className="opacity-0 group-hover:opacity-60 transition-opacity duration-200 text-5xl text-[#ece6d8]">
                    ‹
                  </span>
                </button>

                <button
                  type="button"
                  onClick={goPrev}
                  disabled={isFirstSpread && !prevChapter}
                  aria-label={isFirstSpread ? tReader("previousChapter") : tReader("previousPage")}
                  className="group absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-4 disabled:cursor-default cursor-pointer"
                >
                  <span className="opacity-0 group-hover:opacity-60 transition-opacity duration-200 text-5xl text-[#ece6d8]">
                    ›
                  </span>
                </button>
              </div>
            )
          )}
        </Document>
        )}

        {/* End of chapter (vertical mode): previous and next chapter — the
            scroll used to just stop at the last page, and moving on meant
            scrolling all the way back up to the chapter selector. Horizontal mode continues into the
            next chapter by paging past the last spread instead. */}
        {mode === "vertical" && (numPages > 0 || !pdfUrl) && (
          <div className="mt-10 mb-6 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-[#b6b0a2]">
              {tReader("endOf", { badge: formatChapterBadge(currentIsEx, currentDisplayNumber), name: chapterName })}
            </p>
            <ChapterEndNav variant="cards" prev={prevChapterLink} next={nextChapterLink} />
            <Link
              href={`/manga/titles/${mangaId}`}
              className="inline-block py-1.5 -my-1.5 text-sm text-[#b6b0a2] hover:text-[#ece6d8] underline underline-offset-2 transition-colors duration-200"
            >
              {tReader("backTo", { title: mangaTitle })}
            </Link>
          </div>
        )}
      </div>

      <ChapterCommentPanel
        chapterId={currentChapterId}
        currentUserId={currentUserId}
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
        onCommentsSeen={handleCommentsSeen}
      />
    </div>
  );
}