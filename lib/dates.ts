// A chapter's published_date is a CALENDAR DATE the author picked
// ("2026-09-24"), not a moment in time. It's stored as UTC midnight of
// that date (new Date("YYYY-MM-DD") parses as UTC), so it must also be
// DISPLAYED in UTC — formatting it in the viewer's own time zone showed
// every date one day early west of UTC (UTC midnight is still the previous
// evening there), and let the server and browser render different text for
// the same date (a hydration mismatch).
// `locale` is an Intl tag ("en-US", "th-TH"; Thai shows Buddhist-era years).
export function formatPublishedDate(date: Date, locale = "en-US"): string {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// "Today" as the person filling in the form sees it — their LOCAL date as
// YYYY-MM-DD for an <input type="date">. new Date().toISOString() is the
// UTC date instead, which is yesterday for anyone east of UTC between
// local midnight and their UTC offset (e.g. before 7am in Thailand).
export function todayLocalISODate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Oldest publish date a chapter can have. Well before this site existed
// (older series can keep their real dates), but late enough to reject the
// 1969-12-31 / 1970-01-01 a blank or zero date turns into.
export const MIN_PUBLISHED_DATE = "1990-01-01";

// Server-side check for a chapter's published_date from the admin forms.
// Returns the date to store (UTC midnight — see formatPublishedDate), or
// null when it's missing, not a real YYYY-MM-DD calendar date (2026-02-30),
// before MIN_PUBLISHED_DATE, or in the future. "Future" allows one extra
// day: the form fills in the author's LOCAL today, which east of UTC is
// already tomorrow's UTC date for part of the day.
export function parsePublishedDate(input: unknown, now: Date = new Date()): Date | null {
  if (typeof input !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const date = new Date(`${input}T00:00:00.000Z`);
  // Date rolls impossible days over (Feb 30 -> Mar 2), so it has to
  // round-trip back to the same string to be a real calendar date.
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== input) return null;
  const latest = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  if (input < MIN_PUBLISHED_DATE || date.getTime() > latest) return null;
  return date;
}

export const PUBLISHED_DATE_ERROR = `Publish date must be a real date between ${MIN_PUBLISHED_DATE} and today.`;
