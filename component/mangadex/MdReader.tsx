"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Columns2, ExternalLink, Rows2 } from "lucide-react";
import { useTranslations } from "next-intl";
import ChapterEndNav, { type ChapterLink } from "@/component/titles/ChapterEndNav";
import {
  READING_MODE_KEY,
  actionForSide,
  canRefresh,
  initialMode,
  preloadTargets,
  shouldPersistMode,
  stepPage,
  type ReadingMode,
} from "@/lib/mangadex/reader-state";

// The reader for MangaDex chapters (/read/[chapterId]): a list of page
// images, shown as one long scroll or one page at a time.
//
// Separate from ChapterReaderClient, which renders our own chapters from
// PDFs with react-pdf. This one only has image URLs to show, and the
// browser loads them straight from MangaDex's image network.
//
// Fixed colours throughout, like the PDF reader: the reader is always
// dark, whatever the site theme.

export interface MdReaderProps {
  chapterId: string;
  mangaId: string;
  mangaTitle: string;
  chapterLabel: string;
  // scanlation groups, credited in the top bar
  groups: string[];
  mangadexUrl: string;
  // data-saver page images, in reading order
  pageUrls: string[];
  longStrip: boolean;
  direction: "rtl" | "ltr";
  prev?: ChapterLink;
  next?: ChapterLink;
  // every readable chapter in this language, for the chapter menu
  chapters: { id: string; label: string }[];
}

const SWIPE_THRESHOLD_PX = 50;
const TAP_MAX_PX = 10;

const noopSubscribe = () => () => {};

function readSavedMode(): string | null {
  try {
    return localStorage.getItem(READING_MODE_KEY);
  } catch {
    // storage blocked (private mode) — fall back to the default
    return null;
  }
}

const barButtonClass =
  "inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60";

// One page: its image, or — once it has failed for good — a note and a
// retry button in its place.
function PageImage({
  index,
  url,
  failed,
  eager,
  className,
  alt,
  failedText,
  retryText,
  onError,
  onRetry,
}: {
  index: number;
  url: string;
  failed: boolean;
  eager: boolean;
  className: string;
  alt: string;
  failedText: string;
  retryText: string;
  onError: (index: number) => void;
  onRetry: (index: number) => void;
}) {
  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full min-h-80 py-16 text-sm text-[#b6b0a2]">
        <p>{failedText}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRetry(index);
          }}
          // keep the press from reaching the page-turn handler underneath
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="px-4 py-2 rounded-md border border-[#ece6d8]/25 text-[#ece6d8] hover:border-[#ece6d8]/60 transition-colors duration-200"
        >
          {retryText}
        </button>
      </div>
    );
  }
  return (
    // A plain <img>, never next/image: these must go from the reader's
    // browser straight to MangaDex's image network, not through our
    // server or Vercel's image optimizer. no-referrer keeps the page
    // address out of the request.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-index={index}
      src={url}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => onError(index)}
      className={className}
    />
  );
}

export default function MdReader({
  chapterId,
  mangaId,
  mangaTitle,
  chapterLabel,
  groups,
  mangadexUrl,
  pageUrls,
  longStrip,
  direction,
  prev,
  next,
  chapters,
}: MdReaderProps) {
  const t = useTranslations("MdReader");
  const tReader = useTranslations("Reader");
  const tBrowse = useTranslations("Browse");
  const router = useRouter();
  const total = pageUrls.length;

  // The reader's saved scroll / page-by-page choice. The server can't
  // read localStorage, so the server render (and hydration) is always
  // the scroll; useSyncExternalStore's separate server snapshot makes the
  // switch to the saved choice a normal re-render, not a mismatch.
  const savedMode = useSyncExternalStore(noopSubscribe, readSavedMode, () => null);
  // set once the reader uses the toggle on this page
  const [chosenMode, setChosenMode] = useState<ReadingMode | null>(null);
  const mode = chosenMode ?? initialMode(savedMode, longStrip);

  function switchMode(nextMode: ReadingMode) {
    setChosenMode(nextMode);
    if (!shouldPersistMode(longStrip)) return;
    try {
      localStorage.setItem(READING_MODE_KEY, nextMode);
    } catch {
      // not saved; the choice still holds for this visit
    }
  }

  // 1..total, or total + 1 for the end-of-chapter panel (page-by-page).
  const [page, setPage] = useState(1);
  const atEnd = page > total;

  // ----- Page images that fail -----
  // The image server address inside the URLs is only good for a few
  // minutes, so a chapter left open comes back to dead links. A failing
  // image fetches a fresh set for the whole chapter — at most once a
  // minute (canRefresh), as often as the sitting needs. A page that
  // fails while no fresh set can be had gets its own retry button.
  const [urls, setUrls] = useState(pageUrls);
  // Bumped when a fresh set of URLs arrives, so every image is created
  // anew and tries again — MangaDex often hands back the very same URLs,
  // and an <img> that already failed wouldn't retry on its own.
  const [generation, setGeneration] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  // Bumped per page by its retry button, for the same reason.
  const [retries, setRetries] = useState<Record<number, number>>({});

  const refreshRunning = useRef(false);
  const lastRefreshAt = useRef<number | null>(null);
  // pages that failed while a refresh was under way — they share its fate
  const waiting = useRef(new Set<number>());

  const markFailed = useCallback((indexes: Iterable<number>) => {
    setFailed((old) => {
      const copy = new Set(old);
      for (const index of indexes) copy.add(index);
      return copy;
    });
  }, []);

  // Fetch a fresh set of URLs. True if one arrived (every image then
  // starts over); false leaves things as they were.
  const refreshUrls = useCallback(async (): Promise<boolean> => {
    refreshRunning.current = true;
    try {
      const res = await fetch(`/api/mangadex/chapter/${chapterId}/pages`);
      const body: { pages?: unknown } | null = res.ok ? await res.json() : null;
      const fresh = body?.pages;
      if (!Array.isArray(fresh) || fresh.length !== total || !fresh.every((u) => typeof u === "string")) return false;
      setUrls(fresh);
      setGeneration((g) => g + 1);
      setFailed(new Set());
      return true;
    } catch {
      return false;
    } finally {
      refreshRunning.current = false;
      lastRefreshAt.current = Date.now();
    }
  }, [chapterId, total]);

  const handleImageError = useCallback(
    (index: number) => {
      if (refreshRunning.current) {
        waiting.current.add(index);
        return;
      }
      if (!canRefresh(lastRefreshAt.current, Date.now())) {
        markFailed([index]);
        return;
      }
      waiting.current = new Set([index]);
      void refreshUrls().then((ok) => {
        if (!ok) markFailed(waiting.current);
        waiting.current = new Set();
      });
    },
    [markFailed, refreshUrls],
  );

  // The first pages are in the server-rendered HTML, so they can fail
  // before React is listening — and an image's error event isn't
  // replayed. Once mounted, pick up any that already failed (finished
  // loading with no picture).
  const pagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const images = pagesRef.current?.querySelectorAll<HTMLImageElement>("img[data-index]") ?? [];
    for (const img of images) {
      if (img.complete && img.naturalWidth === 0) handleImageError(Number(img.dataset.index));
    }
  }, [handleImageError]);

  // A page's own retry button. If a fresh set of URLs is allowed again,
  // get one — after a long pause the old address is dead, and asking it
  // again would fail forever. Otherwise create that one image anew so the
  // browser asks for it again. The URL itself must stay untouched:
  // MangaDex's image network refuses a URL with a query string added
  // when the request carries no referrer, so a "?retry=1" cache-buster
  // never loads.
  const retryPage = useCallback(
    (index: number) => {
      if (!refreshRunning.current && canRefresh(lastRefreshAt.current, Date.now())) {
        void refreshUrls();
        return;
      }
      setRetries((old) => ({ ...old, [index]: (old[index] ?? 0) + 1 }));
      setFailed((old) => {
        const copy = new Set(old);
        copy.delete(index);
        return copy;
      });
    },
    [refreshUrls],
  );

  const pageImage = (index: number, className: string, eager: boolean) => (
    <PageImage
      // a new key creates the image anew, which is what makes it load again
      key={`${index}:${generation}:${retries[index] ?? 0}:${urls[index]}`}
      index={index}
      url={urls[index]}
      failed={failed.has(index)}
      eager={eager}
      className={className}
      alt={t("pageAlt", { page: index + 1 })}
      failedText={t("imageFailed")}
      retryText={t("retry")}
      onError={handleImageError}
      onRetry={retryPage}
    />
  );

  // ----- Top bar: hides while reading down, returns on the way up -----
  const [barVisible, setBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    if (mode !== "vertical") return;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 80) setBarVisible(true);
      else if (delta > 8) setBarVisible(false);
      else if (delta < -8) setBarVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  // ----- Scroll mode: which page is on screen -----
  const pageRefs = useRef(new Map<number, HTMLDivElement>());
  useEffect(() => {
    if (mode !== "vertical") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setPage(Number((entry.target as HTMLElement).dataset.page));
        }
      },
      // a thin band across the middle of the screen: the page crossing it
      // is the one being read
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const el of pageRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [mode, total]);

  // Switching to scroll mode: start at the page that was open.
  // (This effect runs before the one below, so that one sees the page
  // from the render in which the mode changed.)
  const pageAtSwitch = useRef(1);
  useEffect(() => {
    pageAtSwitch.current = page;
  }, [page]);
  useEffect(() => {
    if (mode !== "vertical") return;
    const target = Math.min(pageAtSwitch.current, total);
    if (target > 1) pageRefs.current.get(target)?.scrollIntoView({ block: "start" });
  }, [mode, total]);

  // ----- Page-by-page mode -----
  // Turning a page also puts the bar away: it floats over the top of
  // the page, and someone turning pages is reading, not using the bar.
  // A tap in the middle of the page brings it back.
  const turn = useCallback(
    (action: "forward" | "back") => {
      setPage((current) => stepPage(current, total, action));
      setBarVisible(false);
    },
    [total],
  );

  useEffect(() => {
    if (mode !== "horizontal") return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "SELECT" || target.tagName === "INPUT")) return;
      if (e.key === "ArrowLeft") turn(actionForSide("left", direction));
      else if (e.key === "ArrowRight") turn(actionForSide("right", direction));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, direction, turn]);

  // fetch the next two pages ahead of the reader
  useEffect(() => {
    if (mode !== "horizontal") return;
    for (const target of preloadTargets(page, total)) {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = urls[target - 1];
    }
  }, [mode, page, total, urls]);

  // A tap on the left/right third turns the page, a tap in the middle
  // shows or hides the bar, and a sideways swipe turns the page the way
  // a paper one would (dragging right-to-left reveals the page on the
  // right).
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }
  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    if (Math.abs(dx) <= TAP_MAX_PX && Math.abs(dy) <= TAP_MAX_PX) {
      const width = e.currentTarget.clientWidth;
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      if (x < width / 3) turn(actionForSide("left", direction));
      else if (x > (width * 2) / 3) turn(actionForSide("right", direction));
      else setBarVisible((v) => !v);
      return;
    }
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      // swiping left pulls in what's on the right, and vice versa
      turn(actionForSide(dx < 0 ? "right" : "left", direction));
    }
  }

  const shownPage = Math.min(page, total);
  const pageCounter = t("pageOf", { page: shownPage, total });
  const hasEndNav = Boolean(prev || next);

  return (
    <div ref={pagesRef} className="min-h-screen bg-[#0a0a0a] text-[#ece6d8]">
      {/* Top bar */}
      <div
        className={
          "fixed top-0 inset-x-0 z-20 bg-[#1b1a1c]/95 backdrop-blur border-b border-[#050505] transition-transform duration-300 " +
          (barVisible ? "translate-y-0" : "-translate-y-full")
        }
      >
        <div className="max-w-350 mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href={`/browse/${mangaId}`}
              aria-label={t("back")}
              title={t("back")}
              className={barButtonClass + " shrink-0"}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{mangaTitle}</div>
              <div className="text-xs text-[#b6b0a2] truncate">
                {chapterLabel}
                {groups.length > 0 && ` · ${tBrowse("translatedBy", { groups: groups.join(", ") })}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {mode === "horizontal" && (
              <span className="hidden sm:inline text-sm text-[#b6b0a2] px-2.5 py-1.5 border border-[#050505] rounded bg-[#0a0a0a]/60 tabular-nums">
                {pageCounter}
              </span>
            )}

            {chapters.length > 1 && (
              <select
                aria-label={t("chapterMenu")}
                value={chapterId}
                onChange={(e) => router.push(`/read/${e.target.value}`)}
                className="max-w-28 sm:max-w-56 h-9 px-2 border border-[#050505] rounded-md bg-[#0a0a0a]/60 text-sm text-[#ece6d8] cursor-pointer"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#1b1a1c]">
                    {c.label}
                  </option>
                ))}
              </select>
            )}

            <a
              href={mangadexUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tBrowse("source")}
              title={tBrowse("source")}
              className={barButtonClass}
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* A long strip only reads as a scroll, so it gets no toggle. */}
            {!longStrip && (
              <button
                type="button"
                onClick={() => switchMode(mode === "vertical" ? "horizontal" : "vertical")}
                aria-label={mode === "vertical" ? tReader("toHorizontal") : tReader("toVertical")}
                title={mode === "vertical" ? t("modeHorizontal") : t("modeVertical")}
                className={barButtonClass}
              >
                {mode === "vertical" ? <Columns2 className="w-4 h-4" /> : <Rows2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {mode === "vertical" ? (
        <div className="pt-16 pb-16">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {urls.map((_, index) => (
              <div
                key={index}
                data-page={index + 1}
                ref={(el) => {
                  if (el) pageRefs.current.set(index + 1, el);
                  else pageRefs.current.delete(index + 1);
                }}
                // min-h keeps a not-yet-loaded page from collapsing to
                // nothing, which would make every lazy image "visible" at
                // once and load the whole chapter up front
                className="w-full min-h-80 flex justify-center"
              >
                {pageImage(index, "w-full h-auto select-none", index < 2)}
              </div>
            ))}
          </div>

          {hasEndNav && (
            <div className="flex justify-center px-4 mt-12">
              <ChapterEndNav variant="cards" prev={prev} next={next} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => (pointerStart.current = null)}
            className="h-dvh w-full flex items-center justify-center overflow-hidden touch-pan-y select-none cursor-pointer"
          >
            {atEnd ? (
              <p className="px-6 text-center text-sm text-[#b6b0a2]">{chapterLabel}</p>
            ) : (
              pageImage(shownPage - 1, "max-h-dvh max-w-full w-auto h-auto object-contain", true)
            )}
          </div>

          {/* Phones: the counter as a pill at the bottom (no room in the bar) */}
          <div
            aria-hidden="true"
            className={
              "sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#050505] text-xs text-[#b6b0a2] tabular-nums pointer-events-none transition-opacity duration-300 " +
              (barVisible ? "opacity-100" : "opacity-0")
            }
          >
            {pageCounter}
          </div>

          {(atEnd || page === total) && hasEndNav && (
            <ChapterEndNav variant="bar" direction={direction} prev={prev} next={next} />
          )}
        </>
      )}
    </div>
  );
}
