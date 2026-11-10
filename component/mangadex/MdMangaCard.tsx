import Link from "next/link";
import { useTranslations } from "next-intl";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import type { MdMangaSummary } from "@/lib/mangadex/types";

// A MangaDex title in /search's grid, beside the site's own manga.
// Shaped like MangaCard (same cover box, same text sizes) so the two sit
// in one grid, but separate from it: MangaCard is built around our own
// manga (Prisma fields, favorites, /manga/titles). The "MangaDex" tab on
// the cover says where the title comes from.
export default function MdMangaCard({ manga }: { manga: MdMangaSummary }) {
  const t = useTranslations("Browse");

  return (
    // nofollow: the title page is fetched live from MangaDex and marked
    // noindex; crawlers have no reason to walk into it from here.
    <Link href={`/browse/${manga.id}`} rel="nofollow" className="group flex flex-col gap-2 min-w-0 cursor-pointer">
      <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-surface transition-transform duration-300 group-hover:scale-[1.03]">
        {manga.coverUrl ? (
          // A plain <img>, not next/image: the src is already our own
          // cached pass-through route serving a 256px thumbnail, so the
          // image optimizer would only fetch and re-encode it a second time.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manga.coverUrl}
            alt={manga.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder />
        )}

        {/* Source tab, where MangaCard has its "updated" tab. Fixed
            colors, not theme tokens: it sits on cover art. */}
        <div className="absolute top-0 left-0 pl-2.5 pr-3 py-1.5 bg-neutral-800/80 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold tracking-tight rounded-br-lg shadow-md">
          {t("badge")}
        </div>

        {/* Which languages it can be read in. */}
        {manga.languages.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {manga.languages.map((language) => (
              <span
                key={language}
                className="px-1.5 py-0.5 rounded-sm bg-neutral-900/80 text-white text-[11px] font-semibold uppercase tracking-wide"
              >
                {language}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="font-bold text-xl line-clamp-2 wrap-break-word">{manga.title}</div>
        <div className="text-gray-500 text-base">{t(`status.${manga.status}`)}</div>
      </div>
    </Link>
  );
}
