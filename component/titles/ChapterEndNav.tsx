import Link from "next/link";

export interface ChapterLink {
  href: string;
  // e.g. "#004" — shown on its own in the compact bar
  badge: string;
  name: string;
}

// Previous/next chapter at the end of a chapter in the reader. Fixed
// colours throughout: the reader is always dark, whatever the site theme.
//
// "cards" — vertical mode, below the last page: two cards side by side,
//   previous on the left, next (the main action) on the right.
// "bar"   — horizontal mode, floating over the last page. Manga reads right
//   to left here (the next page is to the LEFT), so the bar follows that:
//   next chapter on the left, previous on the right.
export default function ChapterEndNav({
  prev,
  next,
  variant,
}: {
  prev?: ChapterLink;
  next?: ChapterLink;
  variant: "cards" | "bar";
}) {
  if (variant === "bar") {
    return (
      <nav
        aria-label="Chapters"
        className="fixed left-1/2 -translate-x-1/2 bottom-14 sm:bottom-6 z-30 flex items-center gap-2 p-1.5 rounded-full bg-[#0a0a0a]/85 backdrop-blur-sm border border-[#ece6d8]/15 shadow-lg"
      >
        {next ? (
          <Link
            href={next.href}
            aria-label={`Next chapter: ${next.badge} ${next.name}`}
            className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold whitespace-nowrap hover:bg-[#f6f1f2] transition-colors duration-200"
          >
            <span aria-hidden="true">‹</span> Next <span className="font-normal">{next.badge}</span>
          </Link>
        ) : (
          <span className="flex items-center h-10 px-4 text-sm text-[#b6b0a2] whitespace-nowrap">All caught up</span>
        )}
        {prev && (
          <Link
            href={prev.href}
            aria-label={`Previous chapter: ${prev.badge} ${prev.name}`}
            className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-[#ece6d8]/25 text-[#ece6d8] text-sm whitespace-nowrap hover:border-[#ece6d8]/60 transition-colors duration-200"
          >
            Previous <span className="text-[#b6b0a2]">{prev.badge}</span> <span aria-hidden="true">›</span>
          </Link>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Chapters" className="grid grid-cols-2 gap-3 w-full max-w-md">
      {prev ? (
        <Link
          href={prev.href}
          className="flex flex-col items-start gap-0.5 min-w-0 p-3 rounded-md border border-[#ece6d8]/20 text-left hover:border-[#ece6d8]/50 transition-colors duration-200"
        >
          <span className="text-xs text-[#b6b0a2]">
            <span aria-hidden="true">←</span> Previous
          </span>
          <span className="text-sm text-[#ece6d8] line-clamp-2 wrap-break-word">
            {prev.badge} {prev.name}
          </span>
        </Link>
      ) : (
        // keeps "next" in the right-hand column on the first chapter
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex flex-col items-end gap-0.5 min-w-0 p-3 rounded-md bg-[#ece6d8] text-[#0a0a0a] text-right hover:bg-[#f6f1f2] transition-colors duration-200"
        >
          <span className="text-xs font-semibold">
            Next <span aria-hidden="true">→</span>
          </span>
          <span className="text-sm line-clamp-2 wrap-break-word">
            {next.badge} {next.name}
          </span>
        </Link>
      ) : (
        <span className="flex items-center justify-center p-3 rounded-md border border-dashed border-[#ece6d8]/20 text-sm text-[#b6b0a2] text-center">
          You&apos;re all caught up
        </span>
      )}
    </nav>
  );
}
