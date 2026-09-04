"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Columns2, Rows2, ChevronDown, Languages } from "lucide-react";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ReadingMode = "vertical" | "horizontal";

interface ChapterSummary {
  id: string;
  chapter_number: number;
  chapter_name: string;
}

interface ChapterReaderProps {
  pdfUrl: string;
  chapterLabel: string;
  chapterNumber: number;
  mangaTitle: string;
  mangaId: string;
  chapters: ChapterSummary[];
}

export default function ChapterReaderClient({
  pdfUrl,
  chapterLabel,
  chapterNumber,
  mangaTitle,
  mangaId,
  chapters,
}: ChapterReaderProps) {
  const [mode, setMode] = useState<ReadingMode>("vertical");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState(760);

  const [pageRatios, setPageRatios] = useState<Record<number, number>>({});
  const [readerHeight, setReaderHeight] = useState(760);
  const [viewportWidth, setViewportWidth] = useState(1200);

  const isFullscreen = mode === "horizontal";

  // top bar auto-hides in fullscreen mode unless the mouse is near the
  // top edge of the screen — vertical mode always shows it
  const [topBarVisible, setTopBarVisible] = useState(true);

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

  const onDocumentLoadSuccess = useCallback(async (pdf: any) => {
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
  }, [numPages, pageRatios]);

  const [spreadIdx, setSpreadIdx] = useState(0);
  const currentSpread = spreads[spreadIdx] ?? [];

  const goNext = useCallback(() => {
    setSpreadIdx((i) => Math.min(i + 1, spreads.length - 1));
  }, [spreads.length]);

  const goPrev = useCallback(() => {
    setSpreadIdx((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    setSpreadIdx(0);
  }, [mode, pdfUrl]);

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

  const fallbackWidth = isFullscreen ? Math.min(viewportWidth * 0.42, 480) : Math.min((pageWidth - 12) / 2, 420);

  function pageSizeProps(pageNum: number) {
    const ratio = pageRatios[pageNum];
    const maxWidth = isFullscreen ? viewportWidth - 32 : pageWidth;
    if (ratio === undefined) return { width: fallbackWidth };
    return ratio > 1 ? { width: maxWidth } : { height: readerHeight };
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
            <div className="text-lg uppercase text-[#ece6d8] tracking-wide shrink-0">
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
                  #{String(chapterNumber).padStart(3, "0")}
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
                        c.chapter_number === chapterNumber ? "bg-[#232224] text-[#ece6d8]" : "text-[#b6b0a2]"
                      }`}
                    >
                      <span className="shrink-0">
                        #{String(c.chapter_number).padStart(3, "0")}
                      </span>
                      <span className="truncate">{c.chapter_name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-[#b6b0a2] truncate min-w-0">{chapterLabel}</div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {mode === "horizontal" && (
              <span className="text-sm text-[#b6b0a2] px-2.5 py-1.5 border border-[#050505] rounded bg-[#0a0a0a]/60">
                {pageCounterText}
              </span>
            )}

            {/* Language selector — same status as the chapter selector:
                icon only, not wired to a language list yet */}
            <button
              type="button"
              aria-label="Change language"
              title="Language"
              className="p-2 border border-[#050505] rounded-md text-[#b6b0a2] hover:text-[#ece6d8] hover:border-[#b6b0a2] transition-colors duration-200 bg-[#0a0a0a]/60"
            >
              <Languages className="w-4 h-4" />
            </button>

            {/* Mode toggle */}
            <div className="flex border border-[#050505] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setMode("vertical")}
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
                onClick={() => setMode("horizontal")}
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
        <Document
          key={pdfUrl}
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center text-[#b6b0a2] py-20">Loading chapter…</div>}
          error={<div className="text-center text-[#b6b0a2] py-20">Couldn't load this chapter.</div>}
        >
          {mode === "vertical" ? (
            <div className="flex flex-col items-center">
              {Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="overflow-hidden"
                />
              ))}
            </div>
          ) : (
            <div className="relative flex justify-center items-center w-full h-full">
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
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}