// A chapter's published_date is a CALENDAR DATE the author picked
// ("2026-09-24"), not a moment in time. It's stored as UTC midnight of
// that date (new Date("YYYY-MM-DD") parses as UTC), so it must also be
// DISPLAYED in UTC — formatting it in the viewer's own time zone showed
// every date one day early west of UTC (UTC midnight is still the previous
// evening there), and let the server and browser render different text for
// the same date (a hydration mismatch).
export function formatPublishedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
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
