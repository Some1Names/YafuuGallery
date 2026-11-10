import Link from "next/link";
import { useTranslations } from "next-intl";
import { chipClass } from "@/component/manga/chip-class";
import { browseHref } from "@/lib/mangadex/browse-params";
import type { MdLanguageFilter as Filter } from "@/lib/mangadex/queries";

// The chapter-language choice on /browse: All / ไทย / English. Each is a
// link (the choice lives in ?lang=), so it works without JavaScript and
// the result is shareable. Language names are written in their own
// language, as in the reader's language menu.
const OPTIONS: { value: Filter; label: string | null }[] = [
  { value: "all", label: null },
  { value: "th", label: "ไทย" },
  { value: "en", label: "English" },
];

export default function MdLanguageFilter({ q, active }: { q: string; active: Filter }) {
  const t = useTranslations("Browse");

  return (
    <nav aria-label={t("langLabel")} className="mb-6 sm:mb-8">
      <ul className="flex flex-wrap gap-2">
        {OPTIONS.map(({ value, label }) => (
          <li key={value}>
            <Link
              href={browseHref({ q, lang: value })}
              scroll={false}
              aria-current={active === value ? "true" : undefined}
              className={chipClass(active === value) + " inline-block"}
            >
              {label ?? t("langAll")}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
