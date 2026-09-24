// Shared by MangaCard's "updated X ago" badge and the chapter comment
// panel's per-comment timestamps.
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let value = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [amount, u] of units) {
    if (Math.abs(value) < amount) {
      unit = u;
      break;
    }
    value /= amount;
  }

  return rtf.format(-Math.round(value), unit);
}

// Whether `date` is more than `ms` in the past — MangaCard's "stale
// update" check (its badge goes from red to gray after a week).
export function isOlderThan(date: Date, ms: number): boolean {
  return Date.now() - date.getTime() > ms;
}
