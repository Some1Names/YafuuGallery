// The interface languages (not the chapter-file languages — see
// lib/language.ts for those). Safe to import from client components.
export const LOCALES = ["en", "th"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

// Set by the language switch; read on every request (i18n/request.ts).
// Without it, a visitor gets their browser's language (pickLocale).
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

// First-visit language from the Accept-Language header: the supported
// language the browser ranks highest (q-values honoured, "th-TH" counts as
// "th"), else English.
export function pickLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  return ranked.map((entry) => entry.lang).find(isLocale) ?? DEFAULT_LOCALE;
}

// BCP 47 tag for Intl formatting (dates, numbers). Thai uses the Thai
// calendar's Buddhist-era years (2569), as Thai readers expect.
export const INTL_LOCALE: Record<Locale, string> = { en: "en-US", th: "th-TH" };
