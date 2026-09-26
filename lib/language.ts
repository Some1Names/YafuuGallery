// Mirrors the Prisma `Language` enum (th/en/ja) as a plain string union so
// client components can use it without importing generated Prisma types.
// Shared between the admin chapter-PDF upload UI and the reader's language
// switcher so both list the same three languages in the same order.

export type Language = "th" | "en" | "ja";

export const LANGUAGE_LABELS: Record<Language, string> = {
  th: "Thai",
  en: "English",
  ja: "Japanese",
};

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "th", label: LANGUAGE_LABELS.th },
  { value: "en", label: LANGUAGE_LABELS.en },
  { value: "ja", label: LANGUAGE_LABELS.ja },
];

// Distinct languages in LANGUAGE_OPTIONS order — so "Thai · English" reads
// the same everywhere, whatever order the chapters' files were added in.
export function sortLanguages(languages: Iterable<Language>): Language[] {
  const present = new Set(languages);
  return LANGUAGE_OPTIONS.map((o) => o.value).filter((l) => present.has(l));
}
