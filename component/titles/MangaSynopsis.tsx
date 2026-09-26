"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// The manga's synopsis. On phones it's cut to four lines with a More/Less
// toggle — in full it pushed the chapter list a screen or more down. From
// sm up it sits in the side column, so it's always shown whole there.
export default function MangaSynopsis({ text }: { text: string }) {
  const t = useTranslations("Manga");
  const [isExpanded, setIsExpanded] = useState(false);
  // whether the four-line clamp is actually hiding anything (short
  // synopses, and every synopsis from sm up, get no button)
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      // only measure while the clamp is on — expanded (or sm up) the text
      // always fits, and forgetting it's long would drop the button for a
      // frame when collapsing again
      if (getComputedStyle(el).webkitLineClamp === "none") return;
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <p
        ref={ref}
        id="manga-synopsis"
        className={"text-base leading-relaxed text-fg/90 " + (isExpanded ? "" : "max-sm:line-clamp-4")}
      >
        {text}
      </p>
      {(isClamped || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls="manga-synopsis"
          className="sm:hidden mt-1 py-2 text-sm font-medium text-fg-secondary hover:text-fg transition-colors duration-200"
        >
          {isExpanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
}
