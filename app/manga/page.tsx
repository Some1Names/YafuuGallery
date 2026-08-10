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
  pdfUrl: "/chapters/chapter-1.pdf",
  chapterLabel: "Chapter 1: Prelude",
  mangaTitle: "Dome Disaster",
};

export default function ChapterReaderPage(props: Partial<ChapterReaderProps> = {}) {
  const { pdfUrl, chapterLabel, mangaTitle } = { ...defaultProps, ...props };

  const [mode, setMode] = useState<ReadingMode>("vertical");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(760);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageIndex(0);
  }, []);

  const goNext = useCallback(() => {
    setPageIndex((p) => Math.min(p + 1, numPages - 1));
  }, [numPages]);

  const goPrev = useCallback(() => {
    setPageIndex((p) => Math.max(p - 1, 0));
  }, []);

  // keyboard nav for horizontal mode
  useEffect(() => {
    if (mode !== "horizontal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNext, goPrev]);

  // responsive page width
  useEffect(() => {
    const update = () => setPageWidth(Math.min(window.innerWidth - 48, 760));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} min-h-screen bg-[#0a0a0a] text-[#ece6d8] font-[family-name:var(--font-body)]`}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b-2 border-[#050505]">
        <div className="max-w-225 mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[2px] text-[#9c1d25] font-[family-name:var(--font-mono)]">
              {mangaTitle}
            </div>
            <div className="text-base truncate font-[family-name:var(--font-display)]">{chapterLabel}</div>
          </div>

          {/* Mode toggle */}
          <div className="flex shrink-0 border-2 border-[#050505] rounded-md overflow-hidden">
            <button
              onClick={() => setMode("vertical")}
              className={`px-3 py-2 text-xs uppercase tracking-wide transition-colors font-[family-name:var(--font-mono)] ${
                mode === "vertical" ? "bg-[#9c1d25] text-[#ece6d8]" : "bg-[#1b1a1c] text-[#b6b0a2] hover:bg-[#232224]"
              }`}
            >
              Vertical
            </button>
            <button
              onClick={() => setMode("horizontal")}
              className={`px-3 py-2 text-xs uppercase tracking-wide transition-colors border-l-2 border-[#050505] font-[family-name:var(--font-mono)] ${
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
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<div className="text-center text-[#b6b0a2] py-20 font-[family-name:var(--font-mono)]">Loading chapter…</div>}
          error={<div className="text-center text-[#b6b0a2] py-20 font-[family-name:var(--font-mono)]">Couldn't load this chapter.</div>}
        >
          {mode === "vertical" ? (
            <div className="flex flex-col items-center gap-2">
              {Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="border-2 border-[#050505] rounded-sm overflow-hidden"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Page
                pageNumber={pageIndex + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="border-2 border-[#050505] rounded-sm overflow-hidden"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={goPrev}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 border-2 border-[#050505] rounded-md bg-[#1b1a1c] hover:bg-[#232224] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-[family-name:var(--font-mono)]"
                >
                  ← Prev
                </button>
                <span className="text-sm text-[#b6b0a2] font-[family-name:var(--font-mono)]">
                  {numPages > 0 ? `${pageIndex + 1} / ${numPages}` : "—"}
                </span>
                <button
                  onClick={goNext}
                  disabled={pageIndex >= numPages - 1}
                  className="px-4 py-2 border-2 border-[#050505] rounded-md bg-[#1b1a1c] hover:bg-[#232224] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-[family-name:var(--font-mono)]"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}