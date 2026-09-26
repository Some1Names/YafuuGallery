import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_URL } from "@/component/LegalPage";
import { useTranslations } from "next-intl";

const browseLinks = [
  { href: "/", labelKey: "home" },
  { href: "/favorites", labelKey: "favorites" },
  { href: "/search", labelKey: "search" },
] as const;

const aboutLinks = [
  { href: "/privacy", labelKey: "privacy" },
  { href: "/terms", labelKey: "terms" },
] as const;

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-nav">
      <div className="max-w-350 mx-auto px-6 md:px-8 py-12 flex flex-col gap-10 sm:grid sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl tracking-wide text-fg font-(family-name:--font-display)">
              YafuuGallery
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-danger" aria-hidden="true" />
          </div>
          <p className="text-sm text-fg-secondary mt-3 max-w-60">{t("tagline")}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:contents">
          <div>
            <span className="text-xs text-fg-muted">{t("browse")}</span>
            <ul className="mt-3 flex flex-col gap-2.5">
              {browseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 -my-1 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs text-fg-muted">{t("about")}</span>
            <ul className="mt-3 flex flex-col gap-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 -my-1 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
              {/* Instagram DMs are the contact channel — questions, account
                  deletion, takedown requests (see /privacy, /terms) */}
              <li>
                <a
                  href={CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 py-1 -my-1 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
                >
                  {t("contact")}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-350 mx-auto px-6 md:px-8 py-5">
          <p className="text-xs text-fg-muted">© {year} — By The &quot;ONE&quot; and Only YafuuYufaa.</p>
        </div>
      </div>
    </footer>
  );
}