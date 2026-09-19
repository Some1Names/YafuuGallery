"use client";

import { useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Unknown on the server — default to "reduced motion" so the first paint
// matches a plain, unsmoothed scroll rather than guessing.
function getServerSnapshot() {
  return true;
}

// Scoped to the (main) route group only — the (fullscreen) group (viewer,
// login/signup) deliberately skips this, since the chapter reader drives
// its own scroll/swipe physics and a second smoothing layer would fight it.
export default function SmoothScroll() {
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (prefersReducedMotion) return null;
  return <ReactLenis root />;
}
