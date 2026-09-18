"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Columns2, Rows2, ChevronDown, Languages, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChapterDisplayNumbers, formatChapterBadge } from "@/lib/chapter-number";
import { LANGUAGE_LABELS, type Language } from "@/lib/language";
import ChapterCommentPanel from "./ChapterCommentPanel";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SWIPE_THRESHOLD_PX = 50;

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
  // null for a signed-out visitor — the comment bubble sends them to
  // /signup instead of opening the panel when this is null.
  currentUserId: string | null;
  initialCommentCount: number;
}

export default function ChapterReaderClient({
  translations,
  currentChapterId,
  chapterName,
  mangaTitle,
  mangaId,
  chapters,
  currentUserId,
  initialCommentCount,
}: ChapterReaderProps) {
  const router = useRouter();
  const displayNumbers = useMemo(() => getChapterDisplayNumbers(chapters), [chapters]);
  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const currentIsEx = currentChapter?.chapter_is_ex ?? false;
  const currentDisplayNumber = displayNumbers.get(currentChapterId);
  const chapterLabel = `Chapter ${currentIsEx ? "ex" : (currentDisplayNumber ?? 0)}: ${chapterName}`;
  const [mode, setMode] = useState<ReadingMode>("vertical");

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

  useEffect(() => {
    if (!isLanguageMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
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
  // top edge of the screen — vertical mode always shows it
  const [topBarVisible, setTopBarVisible] = useState(true);

  // Comment panel — signed-out visitors never see it open at all (the
  // bubble button sends them to /signup instead), so no signed-out UI
  // exists inside ChapterCommentPanel itself.
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  function handleCommentButtonClick() {
    if (!currentUserId) {
      router.push("/signup");
      return;
    }
    setIsCommentPanelOpen((v) => !v);
  }

  useEffect(() => {
    setIsCommentPanelOpen(false);
    setCommentCount(initialCommentCount);
  }, [currentChapterId, initialCommentCount]);

  // chapter-selector dropdown
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const chapterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isChapterMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (chapterMenuRef.current && !chapterMenuRef.current.contains(e.target as Node)) {
        setIsChapterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isChapterMenuOpen]);

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

  // The single source of truth for reading position, shared by both modes,
  // so switching modes lands on the same page instead of jumping back to
  // the start. Horizontal mode's spreadIdx is derived from it below;
  // vertical mode's scroll position is synced to/from it via pageRefs.
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef = useRef(1);
  // Mirrored every render (no dependency array — meant to stay
  // unconditionally in sync) so the scroll-restore effect below can read
  // the latest value without listing it as an effect dependency, which
  // would re-run it on every scroll-tracked page change instead of only on
  // an actual mode switch.
  useEffect(() => {
    currentPageRef.current = currentPage;
  });

  // Vertical mode's page wrapper divs, keyed by page number — used to jump
  // the scroll position to currentPage when entering vertical mode, and to
  // read the currently-scrolled-to page when leaving it.
  const pageRefs = useRef(new Map<number, HTMLDivElement>());

  const spreadIdx = useMemo(() => {
    const idx = spreads.findIndex((s) => s.includes(currentPage));
    return idx >= 0 ? idx : 0;
  }, [spreads, currentPage]);
  const currentSpread = spreads[spreadIdx] ?? [];

  const goNext = useCallback(() => {
    const next = spreads[Math.min(spreadIdx + 1, spreads.length - 1)];
    if (next?.[0] !== undefined) setCurrentPage(next[0]);
  }, [spreads, spreadIdx]);

  const goPrev = useCallback(() => {
    const prev = spreads[Math.max(spreadIdx - 1, 0)];
    if (prev?.[0] !== undefined) setCurrentPage(prev[0]);
  }, [spreads, spreadIdx]);

  // Finds whichever page is nearest the viewport's vertical center in
  // vertical mode's scrolled list — used to capture reading position right
  // before switching into horizontal mode.
  function findCurrentPageInVerticalView(): number {
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
  }

  function switchMode(next: ReadingMode) {
    if (mode === "vertical" && next === "horizontal") {
      setCurrentPage(findCurrentPageInVerticalView());
    }
    setMode(next);
  }

  // Mobile horizontal mode turns pages by swipe instead of the left/right
  // tap zones desktop uses (those stay click-based, mouse-only). RTL: a
  // left swipe (negative delta) advances forward — same direction as
  // desktop's left zone — a right swipe goes back.
  const swipeStartXRef = useRef(0);
  const isSwipingRef = useRef(false);

  function handleSwipeStart(e: React.PointerEvent<HTMLDivElement>) {
    swipeStartXRef.current = e.clientX;
    isSwipingRef.current = true;
  }

  function handleSwipeEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    const delta = e.clientX - swipeStartXRef.current;
    if (delta < -SWIPE_THRESHOLD_PX) goNext();
    else if (delta > SWIPE_THRESHOLD_PX) goPrev();
  }

  function handleSwipeCancel() {
    isSwipingRef.current = false;
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [pdfUrl]);

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

  // top bar visibility follows the mouse only in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) {
      setTopBarVisible(true);
      return;
    }
    setTopBarVisible(false); // start hidden in fullscreen until the mouse moves up
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
        <div className="mx-auto px-6 md:px-32 h-20 flex items-center justify-between gap-4">
          <div className="flex gap-5 items-center min-w-0 flex-1">
            <Link
              href={`/manga/titles/${mangaId}`}
              aria-label="Back to manga title"
              className="text-2xl text-[#ece6d8] hover:text-[#b6b0a2] transition-colors duration-200 shrink-0"
            >
              <span>‹</span>
            </Link>
            <div className="hidden sm:block text-lg uppercase text-[#ece6d8] tracking-wide shrink-0">
              {mangaTitle}
            </div>

            {/* Chapter selector — real chapter number, dropdown lists every
                chapter in this manga */}
            <div className="relative shrink-0" ref={chapterMenuRef}>
              <button
                type="button"
                onClick={() => setIsChapterMenuOpen((v) => !v)}
                aria-expanded={isChapterMenuOpen}
                aria-haspopup="listbox"
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

              {isChapterMenuOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg z-30"
                >
                  {chapters.map((c) => (
                    <Link
                      key={c.id}
                      href={`/viewer/${c.id}`}
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

          <div className="flex items-center gap-3 shrink-0">
            {mode === "horizontal" && (
              <span className="text-sm text-[#b6b0a2] px-2.5 py-1.5 border border-[#050505] rounded bg-[#0a0a0a]/60">
                {pageCounterText}
              </span>
            )}

            {/* Comments — signed-out visitors get sent to /signup instead
                of the panel opening (handleCommentButtonClick). */}
            <button
              type="button"
              onClick={handleCommentButtonClick}
              aria-label="Comments"
              title="Comments"
              className="relative inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#ece6d8] text-[#0a0a0a] text-[10px] font-semibold leading-4 text-center">
                  {commentCount > 99 ? "99+" : commentCount}
                </span>
              )}
            </button>

            {/* Language selector — only shown once a chapter actually has
                more than one translation to switch between; with 0 or 1
                there's nothing to pick, so the icon isn't rendered at all
                rather than sitting there doing nothing. */}
            {translations.length > 1 && (
              <div className="relative hidden sm:block" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((v) => !v)}
                  aria-expanded={isLanguageMenuOpen}
                  aria-haspopup="listbox"
                  aria-label="Change language"
                  title="Language"
                  className="inline-flex p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
                >
                  <Languages className="w-4 h-4" />
                </button>

                {isLanguageMenuOpen && (
                  <div
                    role="listbox"
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
                        aria-current={t.language === activeLanguage}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#232224] transition-colors duration-200 ${
                          t.language === activeLanguage ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2]"
                        }`}
                      >
                        {LANGUAGE_LABELS[t.language]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mode toggle */}
            <div className="flex border border-[#050505] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => switchMode("vertical")}
                aria-pressed={mode === "vertical"}
                aria-label="Vertical reading mode"
                title="Vertical"
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
                aria-label="Horizontal reading mode"
                title="Horizontal"
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
            This chapter&apos;s file hasn&apos;t been uploaded yet.
          </div>
        ) : (
        <Document
          key={pdfUrl}
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center text-[#b6b0a2] py-20">Loading chapter…</div>}
          error={<div className="text-center text-[#b6b0a2] py-20">Couldn&apos;t load this chapter.</div>}
        >
          {mode === "vertical" ? (
            <div className="flex flex-col items-center">
              {Array.from({ length: numPages }, (_, i) => {
                const n = i + 1;
                return (
                  <div
                    key={n}
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
                    <Page
                      pageNumber={n}
                      width={pageWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      className="overflow-hidden"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`relative flex justify-center items-center w-full h-full ${isMobile ? "touch-pan-y" : ""}`}
              onPointerDown={isMobile ? handleSwipeStart : undefined}
              onPointerUp={isMobile ? handleSwipeEnd : undefined}
              onPointerCancel={isMobile ? handleSwipeCancel : undefined}
            >
              {/* RTL: currentSpread[0] is read first → renders on the right.
                  currentSpread[1] (if present) is read second → renders on the left. */}
              {currentSpread.length === 2 && (
                <Page
                  pageNumber={currentSpread[1]}
                  {...pageSizeProps(currentSpread[1])}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="overflow-hidden"
                />
              )}
              {currentSpread[0] !== undefined && (
                <Page
                  pageNumber={currentSpread[0]}
                  {...pageSizeProps(currentSpread[0])}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="overflow-hidden"
                />
              )}

              {/* Tap zones — desktop (mouse) only. Mobile turns pages by
                  swipe instead, handled by the pointer events above. */}
              {!isMobile && (
                <>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={spreadIdx >= spreads.length - 1}
                    aria-label="Next page"
                    className="group absolute left-0 top-0 h-full w-1/2 flex items-center justify-start pl-4 disabled:cursor-default cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-60 transition-opacity duration-200 text-5xl text-[#ece6d8]">
                      ‹
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={spreadIdx === 0}
                    aria-label="Previous page"
                    className="group absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-4 disabled:cursor-default cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-60 transition-opacity duration-200 text-5xl text-[#ece6d8]">
                      ›
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </Document>
        )}
      </div>

      <ChapterCommentPanel
        chapterId={currentChapterId}
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
        onCommentPosted={() => setCommentCount((c) => c + 1)}
      />
    </div>
  );
}