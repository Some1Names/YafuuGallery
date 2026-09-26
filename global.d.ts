import type messages from "./messages/en.json";
import type { Locale } from "./i18n/locales";

// Types every t("…") key against messages/en.json (th.json has the same
// keys), so a typo or a missing key fails the typecheck instead of showing
// the raw key on the page.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
