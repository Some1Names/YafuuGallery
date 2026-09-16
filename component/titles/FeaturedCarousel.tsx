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
  // Which way the text content should slide in from — recomputed on every
  // index change so dots/arrows/swipe/auto-advance all animate in the
  // direction that actually matches the motion (shortest path for a dot
  // jump, so e.g. going from the last slide to the first via "next" slides
  // forward, not backward across the whole set).
  const [direction, setDirection] = useState<1 | -1>(1);

  const dragStartXRef = useRef(0);
  const isPotentialDragRef = useRef(false);
  const isDraggingRef = useRef(false);

  const count = manga.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // Re-armed on every index change (auto or manual) so a manual jump
    // doesn't get immediately overridden by an already-in-flight timer.
  }, [count, activeIndex]);

  // manga[activeIndex] is undefined when count === 0 — fine here since
  // every hook below only seeds/tracks it, and the component bails out
  // (below, after all hooks have run) before anything renders it. Every
  // hook has to be declared before that early return regardless, or
  // they'd be skipped on some renders and not others, which breaks React's
  // rules of hooks.
  const current = manga[activeIndex];

  // The background banner crossfades by keeping the previous slide's image
  // sitting statically underneath while the new one fades in on top. The
  // top layer is a single persistent DOM node (never remounted) whose
  // opacity is driven by state instead of a key-triggered CSS animation.
  // (A key-remounted version of this layer was originally blamed for an
  // intermittent dev-only "useInsertionEffect must not schedule updates"
  // warning; that turned out to actually come from RouteProgressBar's
  // patched history.pushState, unrelated to this component. Kept this
  // approach anyway — not remounting a full-bleed background node on every
  // slide change is the better default regardless.) topOpacity drops to 0
  // the instant the slide changes, then
  // a setTimeout flips it back to 1 so the browser actually paints the 0
  // state before transitioning — setting it back on the same tick can get
  // coalesced into one frame and skip the fade. Deliberately setTimeout,
  // not requestAnimationFrame: rAF simply never fires while a tab is
  // backgrounded (confirmed — not just throttled), which would leave the
  // image stuck invisible if a slide changed while the tab wasn't in the
  // foreground; a timer still fires (possibly delayed) once the tab is
  // visible again. bottomLayer is state (not a ref) because it's read
  // during render; it can briefly lag behind `current` by design (it's
  // meant to still show the outgoing slide while the top layer fades in)
  // but always falls back to `current` below in case it's never been set
  // (count was 0 on an earlier render).
  const [bottomLayer, setBottomLayer] = useState(current);
  const [topOpacity, setTopOpacity] = useState(1);
  useEffect(() => {
    if (!current) return;
    setTopOpacity(0);
    const fadeInTimer = setTimeout(() => setTopOpacity(1), 20);
    const swapTimer = setTimeout(() => setBottomLayer(current), 700);
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(swapTimer);
    };
  }, [current]);

  if (count === 0) return null;

  function goTo(index: number) {
    const next = ((index % count) + count) % count;
    const forwardDistance = (next - activeIndex + count) % count;
    const backwardDistance = (activeIndex - next + count) % count;
    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setActiveIndex(next);
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
        setDirection(-1);
        setActiveIndex((i) => (i - 1 + count) % count);
      } else if (dragOffsetX < -SWIPE_THRESHOLD_PX) {
        setDirection(1);
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
      {/* Bottom layer: the previous slide, sitting still — the top layer
          fading in over it is what creates the crossfade, so this never
          needs its own opacity transition. */}
      {(bottomLayer ?? current).bannerImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${(bottomLayer ?? current).bannerImageUrl}')` }}
        />
      ) : (
        <div className="absolute inset-0">
          <NoImagePlaceholder />
        </div>
      )}
      {/* Top layer: the current slide. Same DOM node the whole time —
          topOpacity (not a key remount) drives the fade so it replays on
          every change without unmounting anything. */}
      {current.bannerImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ backgroundImage: `url('${current.bannerImageUrl}')`, opacity: topOpacity }}
        />
      ) : (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ opacity: topOpacity }}
        >
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
        {/* Keyed on id + direction so a slide change remounts this whole
            block and replays the matching slide-in animation; the
            direction-specific class picks which side it enters from.
            Mirrors the parent's own flex/gap so wrapping these three
            pieces in one more div doesn't change their spacing. */}
        <div
          key={current.id}
          className={`flex flex-col gap-2 items-start ${
            direction === 1 ? "animate-carousel-slide-right" : "animate-carousel-slide-left"
          }`}
        >
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
