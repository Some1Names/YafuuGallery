"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

type ReadingMode = "vertical" | "horizontal";

interface ChapterReaderProps {
  pdfUrl: string;
  chapterLabel: string;
  mangaTitle: string;
}

const defaultProps: ChapterReaderProps = {
  pdfUrl: "/chapters/L01 - Web Fundamentals (1).pdf",
  chapterLabel: "Chapter 1: Prelude",
  mangaTitle: "Dome Disaster",
};

export default function ChapterReaderPage(props: Partial<ChapterReaderProps> = {}) {
  const { pdfUrl, chapterLabel, mangaTitle } = { ...defaultProps, ...props };

  const [mode, setMode] = useState<ReadingMode>("vertical");
  const [numPages, setNumPages] = useState<number>(0);
  // spreadIndex = index of the LEFT page in the current spread (0-based)
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(760);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setSpreadIndex(0);
  }, []);

  // horizontal mode moves TWO pages at a time (a left/right spread)
  const goNext = useCallback(() => {
    setSpreadIndex((p) => (p + 2 < numPages ? p + 2 : p));
  }, [numPages]);

  const goPrev = useCallback(() => {
    setSpreadIndex((p) => Math.max(p - 2, 0));
  }, []);

  // reset to a clean spread boundary whenever mode changes
  useEffect(() => {
    setSpreadIndex((p) => p - (p % 2));
  }, [mode]);

  // manga reads right-to-left: pressing "left" advances the story,
  // pressing "right" goes back
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
    const update = () => setPageWidth(Math.min(window.innerWidth - 48, 760));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // right-to-left reading order: the earlier page (read first) sits on the RIGHT,
  // the later page (read second) sits on the LEFT
  const rightPageNum = spreadIndex + 1;
  const leftPageNum = spreadIndex + 2;
  const hasLeftPage = leftPageNum <= numPages;
  const singlePageWidth = mode === "horizontal" ? Math.min((pageWidth - 12) / 2, 420) : pageWidth;

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} min-h-screen bg-[#0a0a0a] text-[#ece6d8] font-(family-name:--font-body)`}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b-2 border-[#050505]">
        <div className="max-w-225 mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[2px] text-[#9c1d25] font-mono">
              {mangaTitle}
            </div>
            <div className="text-base truncate font-(family-name:--font-display)">{chapterLabel}</div>
          </div>

          {/* Mode toggle */}
          <div className="flex shrink-0 border-2 border-[#050505] rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("vertical")}
              aria-pressed={mode === "vertical"}
              className={`px-3 py-2 text-xs uppercase tracking-wide transition-colors font-mono ${
                mode === "vertical" ? "bg-[#9c1d25] text-[#ece6d8]" : "bg-[#1b1a1c] text-[#b6b0a2] hover:bg-[#232224]"
              }`}
            >
              Vertical
            </button>
            <button
              type="button"
              onClick={() => setMode("horizontal")}
              aria-pressed={mode === "horizontal"}
              className={`px-3 py-2 text-xs uppercase tracking-wide transition-colors border-l-2 border-[#050505] font-mono ${
                mode === "horizontal" ? "bg-[#9c1d25] text-[#ece6d8]" : "bg-[#1b1a1c] text-[#b6b0a2] hover:bg-[#232224]"
              }`}
            >
              Horizontal
            </button>
          </div>
        </div>
      </div>

      {/* Reader */}
      <div className="max-w-225 mx-auto px-4 py-8">
        <Document
          key={pdfUrl}
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<div className="text-center text-[#b6b0a2] py-20 font-mono">Loading chapter…</div>}
          error={<div className="text-center text-[#b6b0a2] py-20 font-mono">Couldn't load this chapter.</div>}
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
            <div className="flex flex-col items-center gap-4">
              {/* right-to-left spread: DOM order is left-page-first so it renders
                  on the visual left, then right-page so it renders on the visual right */}
              <div className="flex justify-center">
                {hasLeftPage && (
                  <Page
                    pageNumber={leftPageNum}
                    width={singlePageWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="overflow-hidden"
                  />
                )}
                <Page
                  pageNumber={rightPageNum}
                  width={singlePageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="overflow-hidden"
                />
              </div>

              {/* button order flipped: "Next" (advance the story) sits on the left,
                  "Prev" sits on the right, matching right-to-left page-turn direction */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={spreadIndex + 2 >= numPages}
                  className="px-4 py-2 border-2 border-[#050505] rounded-md bg-[#1b1a1c] hover:bg-[#232224] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono"
                >
                  ← Next
                </button>
                <span className="text-sm text-[#b6b0a2] font-mono">
                  {numPages > 0
                    ? hasLeftPage
                      ? `${rightPageNum}-${leftPageNum} / ${numPages}`
                      : `${rightPageNum} / ${numPages}`
                    : "—"}
                </span>
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={spreadIndex === 0}
                  className="px-4 py-2 border-2 border-[#050505] rounded-md bg-[#1b1a1c] hover:bg-[#232224] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono"
                >
                  Prev →
                </button>
              </div>
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}