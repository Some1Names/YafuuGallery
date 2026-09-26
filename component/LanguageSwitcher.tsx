"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages, LoaderCircle } from "lucide-react";
import { finishRouteProgress, startRouteProgress } from "@/component/RouteProgressBar";
import { setLocale } from "@/i18n/actions";
import type { Locale } from "@/i18n/locales";

// Each language named in itself, so it's recognisable whichever one the
// page is currently in.
const NATIVE_NAME: Record<Locale, string> = { en: "English", th: "ไทย" };
const SHORT_NAME: Record<Locale, string> = { en: "EN", th: "ไทย" };

// The interface-language switch (EN ⇄ ไทย): stores the choice in a cookie
// (i18n/actions.ts) and re-renders the page in it. Two looks, like
// ThemeToggle — "icon" for the desktop bar, "menuitem" for the phone menu.
// Both show the language the page is in now (translate icon + its name);
// a click switches to the other one. While the page re-renders in the new
// language the icon spins and the top progress bar runs, like navigating.
export default function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "menuitem" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const target: Locale = locale === "th" ? "en" : "th";
  const switchLabel = t("switchTo", { language: NATIVE_NAME[target] });
  // what screen readers hear after the visible name
  const srLabel = isPending ? t("switching") : switchLabel;
  const Icon = isPending ? LoaderCircle : Languages;
  const iconClass = "w-4 h-4 shrink-0" + (isPending ? " motion-safe:animate-spin" : "");

  // The transition (cookie + refresh) is over once the page is in the new
  // language. Only on pending → done: finishing on mount too would cut
  // short a navigation's bar when the phone menu opens mid-navigation.
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending) finishRouteProgress();
    wasPending.current = isPending;
  }, [isPending]);

  function switchLanguage() {
    startRouteProgress();
    startTransition(async () => {
      await setLocale(target);
      router.refresh();
    });
  }

  if (variant === "menuitem") {
    // Same row shape as ThemeToggle's "Light mode": a fixed label, with
    // the current setting on the right
    return (
      <button
        type="button"
        onClick={switchLanguage}
        disabled={isPending}
        aria-busy={isPending}
        title={switchLabel}
        className="relative flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg-secondary hover:text-fg disabled:cursor-wait transition-colors duration-200"
      >
        <Icon className={iconClass} aria-hidden="true" />
        <span className="whitespace-nowrap">{t("label")}</span>
        <span lang={locale} className="ml-auto text-fg">
          {NATIVE_NAME[locale]}
        </span>
        <span className="sr-only">, {srLabel}</span>
      </button>
    );
  }

  // Accessible name "EN, Switch to ไทย" — starts with the visible text
  return (
    <button
      type="button"
      onClick={switchLanguage}
      disabled={isPending}
      aria-busy={isPending}
      title={switchLabel}
      className="h-9 px-2 flex items-center gap-1.5 rounded-md text-xs font-semibold text-fg-secondary hover:text-fg hover:bg-surface-hover disabled:cursor-wait transition-colors duration-200"
    >
      <Icon className={iconClass} aria-hidden="true" />
      <span lang={locale}>{SHORT_NAME[locale]}</span>
      <span className="sr-only">, {srLabel}</span>
    </button>
  );
}
