import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, pickLocale } from "./locales";

// next-intl's per-request config (wired up in next.config.ts). The
// interface language is the switch's cookie if set, else the browser's
// Accept-Language — URLs don't carry a locale.
export default getRequestConfig(async () => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(fromCookie) ? fromCookie : pickLocale((await headers()).get("accept-language"));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Server renders format in UTC (as components/LocalDate does before
    // switching to the viewer's own zone in the browser).
    timeZone: "UTC",
  };
});
