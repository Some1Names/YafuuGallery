import Link from "next/link";
import { useTranslations } from "next-intl";

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
// "bar"   — horizontal mode, floating over the last page. Follows the
//   reading direction: manga (rtl) runs right to left — the next page is to
//   the LEFT — so next chapter sits on the left, previous on the right;
//   comic book style (ltr) is the mirror image.
export default function ChapterEndNav({
  prev,
  next,
  variant,
  direction = "rtl",
}: {
  prev?: ChapterLink;
  next?: ChapterLink;
  variant: "cards" | "bar";
  direction?: "rtl" | "ltr";
}) {
  const t = useTranslations("EndNav");
  if (variant === "bar") {
    const isRtl = direction === "rtl";
    // the arrow on each button's outer side, pointing where it leads
    const nextArrow = <span aria-hidden="true">{isRtl ? "‹" : "›"}</span>;
    const prevArrow = <span aria-hidden="true">{isRtl ? "›" : "‹"}</span>;
    const nextItem = next ? (
      <Link
        href={next.href}
        aria-label={t("nextChapter", { badge: next.badge, name: next.name })}
        className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold whitespace-nowrap hover:bg-[#f6f1f2] transition-colors duration-200"
      >
        {isRtl && nextArrow} {t("next")} <span className="font-normal">{next.badge}</span> {!isRtl && nextArrow}
      </Link>
    ) : (
      <span className="flex items-center h-10 px-4 text-sm text-[#b6b0a2] whitespace-nowrap">{t("allCaughtUp")}</span>
    );
    const prevItem = prev && (
      <Link
        href={prev.href}
        aria-label={t("previousChapter", { badge: prev.badge, name: prev.name })}
        className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-[#ece6d8]/25 text-[#ece6d8] text-sm whitespace-nowrap hover:border-[#ece6d8]/60 transition-colors duration-200"
      >
        {!isRtl && prevArrow} {t("previous")} <span className="text-[#b6b0a2]">{prev.badge}</span> {isRtl && prevArrow}
      </Link>
    );
    return (
      <nav
        aria-label={t("label")}
        className="fixed left-1/2 -translate-x-1/2 bottom-14 sm:bottom-6 z-30 flex items-center gap-2 p-1.5 rounded-full bg-[#0a0a0a]/85 backdrop-blur-sm border border-[#ece6d8]/15 shadow-lg"
      >
        {isRtl ? nextItem : prevItem}
        {isRtl ? prevItem : nextItem}
      </nav>
    );
  }

  return (
    // Both: side by side. Only one (first/newest chapter) or none (a
    // one-shot): stacked and centred — a lone card or "all caught up" in
    // one column of the two looked off to one side.
    <nav
      aria-label={t("label")}
      className={
        prev && next
          ? "grid grid-cols-2 gap-3 w-full max-w-md"
          : "flex flex-col items-center gap-3 w-full max-w-md text-center"
      }
    >
      {!next && <p className="text-base text-[#ece6d8]">{t("youreAllCaughtUp")}</p>}
      {prev && (
        <Link
          href={prev.href}
          className={
            "flex flex-col gap-0.5 min-w-0 p-3 rounded-md border border-[#ece6d8]/20 hover:border-[#ece6d8]/50 transition-colors duration-200 " +
            (next ? "items-start text-left" : "items-center w-full max-w-60")
          }
        >
          <span className="text-xs text-[#b6b0a2]">
            <span aria-hidden="true">←</span> {t("previous")}
          </span>
          <span className="text-sm text-[#ece6d8] line-clamp-2 wrap-break-word">
            {prev.badge} {prev.name}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className={
            "flex flex-col gap-0.5 min-w-0 p-3 rounded-md bg-[#ece6d8] text-[#0a0a0a] hover:bg-[#f6f1f2] transition-colors duration-200 " +
            (prev ? "items-end text-right" : "items-center w-full max-w-60")
          }
        >
          <span className="text-xs font-semibold">
            {t("next")} <span aria-hidden="true">→</span>
          </span>
          <span className="text-sm line-clamp-2 wrap-break-word">
            {next.badge} {next.name}
          </span>
        </Link>
      )}
    </nav>
  );
}
