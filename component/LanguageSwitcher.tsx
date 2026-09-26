"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { setLocale } from "@/i18n/actions";
import type { Locale } from "@/i18n/locales";

// Each language named in itself, so it's recognisable whichever one the
// page is currently in.
const NATIVE_NAME: Record<Locale, string> = { en: "English", th: "ไทย" };
const SHORT_NAME: Record<Locale, string> = { en: "EN", th: "ไทย" };

// The interface-language switch (EN ⇄ ไทย): stores the choice in a cookie
// (i18n/actions.ts) and re-renders the page in it. Two looks, like
// ThemeToggle — "icon" for the desktop bar, "menuitem" for the phone menu.
export default function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "menuitem" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const target: Locale = locale === "th" ? "en" : "th";

  function switchLanguage() {
    startTransition(async () => {
      await setLocale(target);
      router.refresh();
    });
  }

  if (variant === "menuitem") {
    return (
      <button
        type="button"
        onClick={switchLanguage}
        disabled={isPending}
        lang={target}
        className="relative flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg-secondary hover:text-fg disabled:opacity-50 transition-colors duration-200"
      >
        <Languages className="w-4 h-4" aria-hidden="true" />
        {NATIVE_NAME[target]}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      disabled={isPending}
      aria-label={t("switchTo", { language: NATIVE_NAME[target] })}
      title={t("switchTo", { language: NATIVE_NAME[target] })}
      className="h-9 min-w-9 px-2 flex items-center justify-center rounded-md text-xs font-semibold text-fg-secondary hover:text-fg hover:bg-surface-hover disabled:opacity-50 transition-colors duration-200"
    >
      <span lang={target}>{SHORT_NAME[target]}</span>
    </button>
  );
}
