"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { INTL_LOCALE, type Locale } from "@/i18n/locales";

const noopSubscribe = () => () => {};

// A moment in time (when someone joined, when a comment was posted) shown
// as a date in the VIEWER's own time zone. toLocaleDateString() alone used
// the zone of wherever it happened to run — UTC while the server rendered
// the page, local time in the browser — so a date could be a day off and
// the two renders disagreed (a hydration mismatch warning). The server has
// no way to know the viewer's zone, so the server render and hydration use
// UTC, then the browser switches to local: useSyncExternalStore's separate
// server snapshot makes that a normal re-render rather than a mismatch.
// (Calendar dates like a chapter's publish date are different — those are
// always UTC; see lib/dates.ts.)
export default function LocalDate({
  date,
  options = { month: "short", day: "numeric", year: "numeric" },
}: {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const locale = useLocale() as Locale;
  const inBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const d = typeof date === "string" ? new Date(date) : date;
  return (
    <time dateTime={d.toISOString()}>
      {d.toLocaleDateString(INTL_LOCALE[locale], inBrowser ? options : { ...options, timeZone: "UTC" })}
    </time>
  );
}
