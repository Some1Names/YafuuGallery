import MangaBackground from "@/component/titles/MangaBackground";
import { useTranslations } from "next-intl";

// Instagram DMs are the site's contact channel (no public email) — used by
// the Privacy and Terms pages and the footer.
export const CONTACT_URL = "https://www.instagram.com/yafuuyufaa/";
export const CONTACT_HANDLE = "@yafuuyufaa";

// Shared shell for /privacy and /terms: the usual page header, then a
// readable single column. Sections use <LegalSection>.
export default function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  // shown as "Last updated …" — plain text, it's a fixed calendar date
  updated: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations("Legal");
  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">{title}</h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">{t("lastUpdated", { date: updated })}</p>
        </div>

        <article className="max-w-3xl border border-border rounded-md bg-surface/60 p-5 sm:p-8 flex flex-col gap-8 text-fg-secondary leading-relaxed">
          <div className="text-fg">{intro}</div>
          {children}
        </article>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl text-fg font-(family-name:--font-display)">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 flex flex-col gap-1.5 marker:text-fg-muted">{children}</ul>;
}

export function ContactLink() {
  const t = useTranslations("Legal");
  return (
    <a
      href={CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fg underline underline-offset-2 decoration-fg/30 hover:decoration-fg"
    >
      {t("contact", { handle: CONTACT_HANDLE })}
    </a>
  );
}
