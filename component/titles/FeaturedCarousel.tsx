"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getPrefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Renders today's single-manga hero markup per-slide, plus (when there's
// more than one manga to show) dot indicators and horizontal swipe. Pointer
// Events rather than native HTML5 drag — same reasoning as the admin
// reorder lists: it's the one API that actually works for both mouse and
// touch input.
export default function FeaturedCarousel({ manga }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  // Which edge arrow is showing — whichever one the mouse is nearer to,
  // not both at once. Null (mouse outside the carousel, or on mobile where
  // this never gets set) hides both.
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
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

  // Auto-advance has to be pausable (WCAG 2.2.2 — anything that moves on
  // its own for more than 5s). It pauses while the mouse is over the
  // carousel, while keyboard focus is inside it, and whenever the viewer
  // hits the pause button. Viewers who prefer reduced motion start paused
  // (isUserPaused null = "no explicit choice yet"), but can still press
  // play.
  //
  // The timer itself IS the active dot's progress-fill animation: the
  // slide advances on its animationend, and pausing just sets its
  // animation-play-state. That way a pause resumes from exactly where it
  // stopped instead of restarting a fresh 7s interval, and the fill can
  // never drift out of sync with the actual slide change. Changing slides
  // any other way remounts the fill (it's keyed on activeIndex), which
  // restarts the countdown, same as the old re-armed interval did.
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
    () => false
  );
  const [isUserPaused, setIsUserPaused] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const isPausedByChoice = isUserPaused ?? prefersReducedMotion;
  const isPaused = isPausedByChoice || isHovered || hasKeyboardFocus;

  // manga[activeIndex] is undefined when count === 0 — fine here since
  // every hook below only seeds/tracks it, and the component bails out
  // (below, after all hooks have run) before anything renders it. Every
  // hook has to be declared before that early return regardless, or
  // they'd be skipped on some renders and not others, which breaks React's
  // rules of hooks.
  const current = manga[activeIndex];

  // The background banner does a full-width slide: the incoming (top)
  // layer travels in from the direction-appropriate edge to center while
  // the outgoing (bottom) layer — the previous slide, held in place until
  // this point — travels the rest of the way off the opposite edge at the
  // same time. Both are persistent DOM nodes (never remounted) with their
  // transform driven by state, for the same reason the old crossfade version
  // avoided a key-remount here: not tearing down a full-bleed background
  // node on every slide change is the better default regardless of the
  // (since-disproven, see git history) dev-warning concern that originally
  // motivated it.
  //
  // Each cycle has three beats, every one already established by the old
  // crossfade version's own opacity/offset dance:
  //   1. Instantly (transitionsEnabled off) park the incoming layer just
  //      outside the entry edge — both layers are exactly where the PREVIOUS
  //      cycle's beat 3 left them, so this is a no-op past the very first
  //      render.
  //   2. A setTimeout (not requestAnimationFrame — rAF simply never fires in
  //      a backgrounded tab, confirmed, which would leave a slide change
  //      stuck mid-flight if it happened while the tab wasn't focused) lets
  //      the browser actually paint that parked position before turning
  //      transitions back on and animating both layers across — setting the
  //      target position on the same tick as the parked one can get
  //      coalesced into a single frame and skip the slide entirely.
  //   3. Once the incoming layer has arrived, it becomes the new resting
  //      bottom layer for next time. The outgoing layer's div still says
  //      "off-screen" in its own inline transform from the animation that
  //      just finished, which is fine (it's off-screen) right up until beat
  //      1 of the NEXT cycle needs to reuse that same node as the next
  //      incoming layer — so transitions are turned off again here too, one
  //      beat early, purely so that reuse in the future finds the node
  //      already quiescent rather than mid-transition.
  //
  // isFirstRenderRef skips all of this on mount: both layers start out
  // showing the same (only) slide there, so animating one out from under
  // the other would just be the hero image sliding across a duplicate of
  // itself — the page should simply open with the hero already in place.
  const [bottomLayer, setBottomLayer] = useState(current);
  const [topOffsetPct, setTopOffsetPct] = useState(0);
  const [bottomOffsetPct, setBottomOffsetPct] = useState(0);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    if (!current) return;
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    setTransitionsEnabled(false);
    setTopOffsetPct(direction === 1 ? 100 : -100);
    setBottomOffsetPct(0);

    const startTimer = setTimeout(() => {
      setTransitionsEnabled(true);
      setTopOffsetPct(0);
      setBottomOffsetPct(direction === 1 ? -100 : 100);
    }, 20);
    const swapTimer = setTimeout(() => {
      setTransitionsEnabled(false);
      setBottomLayer(current);
    }, 720);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(swapTimer);
    };
  }, [current, direction]);

  if (count === 0) return null;

  function goTo(index: number) {
    const next = ((index % count) + count) % count;
    const forwardDistance = (next - activeIndex + count) % count;
    const backwardDistance = (activeIndex - next + count) % count;
    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setActiveIndex(next);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (count <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverSide(e.clientX - rect.left < rect.width / 2 ? "left" : "right");
  }

  function handleMouseLeave() {
    setHoverSide(null);
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
      // Fixed height on mobile — 32:9 (the site's standard banner shape,
      // also used by MangaHero) would be unusably short at phone widths
      // once title/synopsis/buttons/dots are overlaid on top, so mobile
      // keeps a content-friendly fixed height and only picks up the real
      // banner ratio from sm: upward. min-h-95 is a floor for that same
      // reason at the narrower end of sm: and up — at ~700px wide, 32:9
      // alone works out to under 200px, well short of the ~316px the
      // text/button block actually needs there, so aspect-ratio would
      // otherwise clip it. The floor only matters up to where 32:9's own
      // height overtakes it (a bit past the md: breakpoint within this
      // section's max-w-350 cap) — from there the box is genuinely 32:9.
      // Either way, a longer title or synopsis on one slide no longer
      // resizes the whole hero as the carousel advances — content is
      // centered inside it instead.
      //
      // w-full is load-bearing: with width left auto, the browser transfers
      // min-h-95 through the 32:9 ratio into a ~1351px minimum width, which
      // overflowed the page (horizontal scrollbar) on any viewport narrower
      // than that. An explicit width keeps the box at the container width
      // and lets min-h-95 just stretch the height instead.
      className="relative w-full h-100 sm:h-auto sm:aspect-32/9 sm:min-h-95 max-w-350 mx-auto flex items-center px-6 md:px-8 rounded-none sm:rounded-lg shadow-none sm:shadow-lg overflow-hidden touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Mouse only: a tap fires pointerenter too, but touch has no
      // matching "leave" until the next tap elsewhere, which would leave
      // the carousel stuck paused after any tap on it.
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      // Only keyboard (:focus-visible) focus pauses — a mouse click on a
      // dot also focuses it, and that shouldn't freeze the carousel for
      // as long as the dot happens to keep focus.
      onFocus={(e) => setHasKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasKeyboardFocus(false);
      }}
    >
      {/* Bottom layer: the outgoing slide, sliding the rest of the way off
          the opposite edge as the top layer slides in over it — see the
          bottomLayer/transitionsEnabled effect above for why this needs its
          own transform rather than just sitting still under a fading top
          layer. */}
      {(bottomLayer ?? current).bannerImageUrl ? (
        <div
          className={`absolute inset-0 bg-cover bg-center motion-reduce:transition-none ${
            transitionsEnabled ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{
            backgroundImage: `url('${(bottomLayer ?? current).bannerImageUrl}')`,
            transform: `translateX(${bottomOffsetPct}%)`,
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 motion-reduce:transition-none ${
            transitionsEnabled ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{ transform: `translateX(${bottomOffsetPct}%)` }}
        >
          <NoImagePlaceholder />
        </div>
      )}
      {/* Top layer: the incoming slide. Same DOM node the whole time —
          topOffsetPct (not a key remount) drives the slide so it replays on
          every change without unmounting anything. */}
      {current.bannerImageUrl ? (
        <div
          className={`absolute inset-0 bg-cover bg-center motion-reduce:transition-none ${
            transitionsEnabled ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{
            backgroundImage: `url('${current.bannerImageUrl}')`,
            transform: `translateX(${topOffsetPct}%)`,
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 motion-reduce:transition-none ${
            transitionsEnabled ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{ transform: `translateX(${topOffsetPct}%)` }}
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
          below the text/dots block. Wider than the visible icon so the
          actual click target is bigger than it looks, with the icon
          pinned to the outer edge (justify-start/end, not center) so a
          wider hitbox doesn't push it inward toward the title/synopsis —
          centering it within a w-32 zone was landing it almost on top of
          the text. Both the icon and its hover backdrop fade in from the
          edge inward (bg-linear-to-*, not a flat color) so hovering shows
          a soft glow rather than a visible hard-edged box. Visibility is
          driven by hoverSide (which half of the carousel the mouse is
          over), not a plain group-hover, so only the nearer arrow shows
          at a time instead of both appearing together. */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous featured manga"
            className={`hidden sm:flex absolute inset-y-0 left-0 z-10 w-24 md:w-32 items-center justify-start pl-4 md:pl-6 text-white/70 hover:text-white hover:bg-linear-to-r hover:from-black/40 hover:to-transparent transition-all duration-300 motion-reduce:transition-none ${
              hoverSide === "left" ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next featured manga"
            className={`hidden sm:flex absolute inset-y-0 right-0 z-10 w-24 md:w-32 items-center justify-end pr-4 md:pr-6 text-white/70 hover:text-white hover:bg-linear-to-l hover:from-black/40 hover:to-transparent transition-all duration-300 motion-reduce:transition-none ${
              hoverSide === "right" ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* pointer-events-none here (re-enabled on each actual link/button
          below) — this wrapper's own box spans its full shrink-to-fit
          width, well past where the title/synopsis text actually renders
          on most slides, and that dead space was sitting on top of (and
          swallowing clicks meant for) the edge-arrow buttons on desktop,
          which render earlier in the DOM at the same z-index. Only the
          real interactive children need to opt back in. */}
      <div className="relative z-10 flex flex-col gap-2 items-start px-6 md:px-10 select-none pointer-events-none">
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
          {/* line-clamp only caps the title's line count, it doesn't
              reserve space for lines that aren't there — without a floor
              here, a one-line title sits shorter than a two-line one,
              which shoves the synopsis/buttons/dots up or down as the
              carousel changes slides. The floor is the label's line +
              gap-2 + two title lines (text-xs/sm = 1/1.25rem line height,
              text-4xl/5xl = 2.5/3rem), and justify-end pushes any unused
              space ABOVE the label rather than leaving a blank line
              between the title and the synopsis. Keep these in sync if
              the label or title text sizes change. */}
          <div className="flex flex-col justify-end gap-2 items-start min-h-26 sm:min-h-27 md:min-h-31">
            <p className="text-white/70 text-xs sm:text-sm">FEATURED MANGA</p>
            <h1
              className="text-4xl md:text-5xl text-white max-w-xl min-w-0 line-clamp-2 wrap-anywhere font-(family-name:--font-display)"
              // min-w-0 is load-bearing for break-words to actually do
              // anything on a narrow (mobile) screen: as a flex column
              // item this h1's default min-width is "auto", which floors
              // it at its own min-content size — and overflow-wrap (what
              // break-words maps to) doesn't reduce that intrinsic size
              // per spec, only how a line already given a width wraps. An
              // unbroken string was rendering at the full max-w-xl (576px)
              // on every viewport, spilling off-screen on mobile and only
              // staying invisible there because the carousel clips
              // overflow. min-w-0 removes that floor so it actually
              // shrinks to the real available width first.
            >
              {current.title}
            </h1>
          </div>

          {/* Phones skip the synopsis: at 14px over the banner's line art it
              was hard to read, clamped mid-sentence anyway, and together with
              stacked buttons the text covered nearly all of the artwork. The
              full synopsis is one tap away on the manga page. max-sm:hidden,
              not hidden — line-clamp sets its own display value. */}
          <p
            className="max-sm:hidden text-white/70 text-sm sm:text-base max-w-lg mt-1 sm:mt-2 line-clamp-3"
            style={{ minHeight: "3lh" }}
          >
            {current.synopsis}
          </p>

          {/* Side by side (stacked full-width on phones they took ~110px of
              the banner). flex-wrap + flex-auto: each button starts at its
              own width and they share the row; only when both can't fit (the
              narrowest ~320px phones) does the second drop to its own line,
              each then filling the width. */}
          <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-2">
            {current.firstChapterId ? (
              <Link
                href={`/viewer/${current.firstChapterId}`}
                className="pointer-events-auto flex-auto sm:flex-none whitespace-nowrap bg-white text-black text-center px-4 sm:px-6 py-3 rounded-md shadow-md hover:bg-white/85 transition-colors duration-200"
              >
                Start Reading
              </Link>
            ) : (
              <span className="pointer-events-auto flex-auto sm:flex-none whitespace-nowrap bg-white/40 text-black/60 text-center px-4 sm:px-6 py-3 rounded-md shadow-md cursor-not-allowed">
                No chapters yet
              </span>
            )}

            <Link
              href={`/manga/titles/${current.id}`}
              className="pointer-events-auto flex-auto sm:flex-none whitespace-nowrap bg-black/20 border border-white/40 text-white text-center px-4 sm:px-6 py-3 rounded-md backdrop-blur-sm hover:bg-black/35 transition-colors duration-200"
            >
              View Manga
            </Link>
          </div>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-1 mt-10">
            <button
              type="button"
              onClick={() => setIsUserPaused(!isPausedByChoice)}
              aria-label={isPausedByChoice ? "Play slideshow" : "Pause slideshow"}
              className="pointer-events-auto -ml-1.5 mr-1 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
            >
              {isPausedByChoice ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
            {/* Each dot is a 24px-tall button with the small visible dot
                inside — the bare 6px dots were too small to hit on a phone.
                px-1 on each keeps the visible spacing between dots at 8px. */}
            <div className="flex items-center">
            {manga.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${m.title}`}
                aria-current={i === activeIndex}
                className="group pointer-events-auto flex items-center h-6 px-1"
              >
                <span
                  className={`relative block h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                    i === activeIndex ? "w-6 bg-white/30" : "w-1.5 bg-white/40 group-hover:bg-white/60"
                  }`}
                >
                {/* Fills over AUTO_ADVANCE_MS to show when the carousel
                    will switch next — and its animationend is what
                    actually advances it (see isPaused above). Keyed on
                    activeIndex so it restarts from empty every time the
                    slide changes, manually or automatically. */}
                {i === activeIndex && (
                  <span
                    key={activeIndex}
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    // Longhands, not the `animation` shorthand: re-applying
                    // a shorthand on rerender would reset play-state.
                    style={{
                      animationName: "carousel-progress",
                      animationDuration: `${AUTO_ADVANCE_MS}ms`,
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                    onAnimationEnd={() => {
                      setDirection(1);
                      setActiveIndex((idx) => (idx + 1) % count);
                    }}
                  />
                )}
                </span>
              </button>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
