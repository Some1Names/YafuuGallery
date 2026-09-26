"use client";

import { useEffect, useRef, useState } from "react";

// A thin top-of-viewport progress bar that shows for every internal
// navigation, site-wide — including the case loading.tsx can't cover:
// when a <Link>'s background prefetch hasn't finished by the time it's
// clicked, Next's router waits for it silently without ever showing the
// route's loading.tsx fallback (documented Next.js behavior, not a bug —
// see "Slow networks" in the linking-and-navigating guide). That gap is
// exactly what read as "click Favorites, nothing happens for a beat, then
// it just changes."
//
// Detects the click in the capture phase (before Next's own Link handler
// can preventDefault it) to start the bar, and detects completion by
// patching history.pushState/replaceState — what Next's client router
// calls once a transition actually commits — rather than usePathname(),
// which would miss query-param-only navigations (e.g. /favorites?tab=...)
// and would require useSearchParams() here. Since this mounts once in the
// root layout, wrapping that in the Suspense boundary useSearchParams()
// needs would opt the entire app out of static rendering.
const START_EVENT = "routeprogress:start";
const DONE_EVENT = "routeprogress:done";

// For in-page work that re-renders the route without a link click — e.g.
// LanguageSwitcher's router.refresh(). Call done when it has finished.
export function startRouteProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}
export function finishRouteProgress() {
  window.dispatchEvent(new Event(DONE_EVENT));
}

export default function RouteProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const growTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function start() {
      if (growTimerRef.current) return;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setVisible(true);
      setProgress(15);
      // Eases toward (but never quite reaches) 88% while the navigation is
      // in flight, so the bar keeps visibly inching forward on a slow
      // request instead of sitting frozen at one spot.
      growTimerRef.current = setInterval(() => {
        setProgress((p) => (p >= 88 ? p : p + (88 - p) * 0.12));
      }, 150);
    }

    function finish() {
      if (growTimerRef.current) {
        clearInterval(growTimerRef.current);
        growTimerRef.current = null;
      }
      // The state updates below are deferred a tick: finish() runs inside
      // the patched pushState/replaceState, which Next's router sometimes
      // calls from inside its own useInsertionEffect — and React disallows
      // scheduling state updates synchronously from there ("useInsertionEffect
      // must not schedule updates"). A macrotask lands after that call
      // stack unwinds regardless of what triggered it.
      setTimeout(() => {
        setProgress(100);
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 200);
      }, 0);
    }

    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.href === window.location.href) return;
      start();
    }

    const originalPush = window.history.pushState.bind(window.history);
    const originalReplace = window.history.replaceState.bind(window.history);
    window.history.pushState = function (...args: Parameters<History["pushState"]>) {
      finish();
      return originalPush(...args);
    };
    window.history.replaceState = function (...args: Parameters<History["replaceState"]>) {
      finish();
      return originalReplace(...args);
    };

    // Capture phase so this sees the click before Link's own handler can
    // preventDefault it.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", finish);
    window.addEventListener(START_EVENT, start);
    window.addEventListener(DONE_EVENT, finish);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", finish);
      window.removeEventListener(START_EVENT, start);
      window.removeEventListener(DONE_EVENT, finish);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      if (growTimerRef.current) clearInterval(growTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none">
      <div
        className="h-full bg-fg"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: progress === 100 ? "opacity 200ms ease-out" : "width 200ms ease-out, opacity 100ms",
        }}
      />
    </div>
  );
}
