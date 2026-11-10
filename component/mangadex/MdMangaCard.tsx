import Link from "next/link";
import { useTranslations } from "next-intl";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import type { MdMangaSummary } from "@/lib/mangadex/types";

// A MangaDex title in the /browse grids. Separate from MangaCard, which
// is built around our own manga (Prisma fields, favorites, /manga/titles).
export default function MdMangaCard({ manga }: { manga: MdMangaSummary }) {
  const t = useTranslations("Browse");

  return (
    <Link href={`/browse/${manga.id}`} className="group flex flex-col gap-2 min-w-0">
      <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-surface transition-transform duration-300 group-hover:scale-[1.03]">
        {manga.coverUrl ? (
          // A plain <img>, not next/image: the src is already our own
          // cached pass-through route serving a 256px thumbnail, so the
          // image optimizer would only fetch and re-encode it a second time.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manga.coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder />
        )}

        {/* Which languages it can be read in. Fixed colors, not theme
            tokens: this sits on cover art, not on the page background. */}
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
        <div className="font-bold text-base sm:text-lg leading-snug line-clamp-2 wrap-break-word">{manga.title}</div>
        <div className="text-fg-muted text-sm">{t(`status.${manga.status}`)}</div>
      </div>
    </Link>
  );
}
