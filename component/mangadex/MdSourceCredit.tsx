import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

// "Source: MangaDex" (a link to the title there) and, when given, the
// scanlation groups that made the translation. MangaDex asks every
// reader app to credit both; this is the one place that renders it.
export default function MdSourceCredit({
  href,
  groups = [],
  className = "",
}: {
  href: string;
  groups?: string[];
  className?: string;
}) {
  const t = useTranslations("Browse");

  return (
    <p className={"flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-secondary " + className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-fg transition-colors duration-200"
      >
        {t("source")}
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
      {groups.length > 0 && <span className="wrap-anywhere">{t("translatedBy", { groups: groups.join(", ") })}</span>}
    </p>
  );
}
