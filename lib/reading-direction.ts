// Which way the reader's horizontal (page-by-page) mode turns a manga's
// pages — the ReadingDirection enum in prisma/schema.prisma, as a plain
// type client components can use. Set per manga in /admin and /manage.
export const READING_DIRECTIONS = ["rtl", "ltr"] as const;

// rtl = manga style (right to left, the default), ltr = comic book style
export type ReadingDirectionValue = (typeof READING_DIRECTIONS)[number];

export function isReadingDirection(value: unknown): value is ReadingDirectionValue {
  return value === "rtl" || value === "ltr";
}
