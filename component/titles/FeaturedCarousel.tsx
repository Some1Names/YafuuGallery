"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";

interface FeaturedMangaSlide {
  id: string;
  title: string;
  synopsis: string;
  bannerImageUrl: string | null;
  firstChapterId: string | null;
}

interface FeaturedCarouselProps {
  manga: FeaturedMangaSlide[];
}

const AUTO_ADVANCE_MS = 7000;
const SWIPE_THRESHOLD_PX = 50;
// How far the pointer has to move before a press is treated as a swipe
// rather than a tap — below this, the underlying "Start Reading"/"View
// Manga" links and dot buttons still get a normal click.
const DRAG_INTENT_PX = 10;

// Renders today's single-manga hero markup per-slide, plus (when there's
// more than one manga to show) dot indicators and horizontal swipe. Pointer
// Events rather than native HTML5 drag — same reasoning as the admin
// reorder lists: it's the one API that actually works for both mouse and
// touch input.
export default function FeaturedCarousel({ manga }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);

  const dragStartXRef = useRef(0);
  const isPotentialDragRef = useRef(false);
  const isDraggingRef = useRef(false);

  const count = manga.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // Re-armed on every index change (auto or manual) so a manual jump
    // doesn't get immediately overridden by an already-in-flight timer.
  }, [count, activeIndex]);

  if (count === 0) return null;

  const current = manga[activeIndex];

  function goTo(index: number) {
    setActiveIndex(((index % count) + count) % count);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (count <= 1) return;
    dragStartXRef.current = e.clientX;
    isPotentialDragRef.current = true;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPotentialDragRef.current) return;
    const delta = e.clientX - dragStartXRef.current;

    if (!isDraggingRef.current && Math.abs(delta) > DRAG_INTENT_PX) {
      isDraggingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    if (isDraggingRef.current) setDragOffsetX(delta);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPotentialDragRef.current) return;
    isPotentialDragRef.current = false;

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (dragOffsetX > SWIPE_THRESHOLD_PX) {
        setActiveIndex((i) => (i - 1 + count) % count);
      } else if (dragOffsetX < -SWIPE_THRESHOLD_PX) {
        setActiveIndex((i) => (i + 1) % count);
      }
      setDragOffsetX(0);
    }
  }

  return (
    <div
      // Fixed height (matching the hero section's own sizing) instead of
      // vertical padding around variable content — a longer title or
      // synopsis on one slide no longer resizes the whole hero as the
      // carousel advances. Content is centered inside it instead.
      className="relative h-100 sm:h-125 md:h-150 max-w-350 mx-auto flex items-center px-6 md:px-8 rounded-none sm:rounded-lg shadow-none sm:shadow-lg overflow-hidden touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {current.bannerImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${current.bannerImageUrl}')` }}
        />
      ) : (
        <div className="absolute inset-0">
          <NoImagePlaceholder />
        </div>
      )}

      {/* Scrim: guarantees text/button contrast no matter how bright the
          banner image is — a light banner would otherwise wash out the
          white text and the white "Start Reading" button */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent" />

      {/* Edge click zones to step through slides — desktop only, since
          swipe already covers this on touch. Sit above the scrim but
          below the text/dots block, and are plain full-height buttons
          rather than a hover-revealed overlay so they're always
          discoverable, not just guessable. */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous featured manga"
            className="hidden sm:flex absolute inset-y-0 left-0 z-10 w-16 md:w-20 items-center justify-center text-white/70 hover:text-white hover:bg-black/20 transition-colors duration-200"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next featured manga"
            className="hidden sm:flex absolute inset-y-0 right-0 z-10 w-16 md:w-20 items-center justify-center text-white/70 hover:text-white hover:bg-black/20 transition-colors duration-200"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div className="relative z-10 flex flex-col gap-2 items-start px-6 md:px-10 select-none">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[#b6b0a2] text-xs sm:text-sm">FEATURED MANGA</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-xl line-clamp-2">{current.title}</h1>
        </div>

        <p className="text-[#b6b0a2] text-sm sm:text-base max-w-lg mt-4 sm:mt-6 line-clamp-3">
          {current.synopsis}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          {current.firstChapterId ? (
            <Link
              href={`/viewer/${current.firstChapterId}`}
              className="bg-white text-black text-center px-6 py-3 rounded-md shadow-md hover:bg-white/85 transition-colors duration-200"
            >
              Start Reading
            </Link>
          ) : (
            <span className="bg-white/40 text-black/60 text-center px-6 py-3 rounded-md shadow-md cursor-not-allowed">
              No chapters yet
            </span>
          )}

          <Link
            href={`/manga/titles/${current.id}`}
            className="bg-black/20 border border-white/40 text-white text-center px-6 py-3 rounded-md backdrop-blur-sm hover:bg-black/35 transition-colors duration-200"
          >
            View Manga
          </Link>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {manga.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${m.title}`}
                aria-current={i === activeIndex}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-white/30" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              >
                {/* Fills over AUTO_ADVANCE_MS to show when the carousel
                    will switch next — keyed on activeIndex so it restarts
                    from empty every time the slide changes, manually or
                    automatically. */}
                {i === activeIndex && (
                  <span
                    key={activeIndex}
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ animation: `carousel-progress ${AUTO_ADVANCE_MS}ms linear` }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
