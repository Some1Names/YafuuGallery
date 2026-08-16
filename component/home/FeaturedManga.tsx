import Link from "next/link";

interface FeaturedMangaProps {
  mangaId: string;
  title: string;
  synopsis: string;
  bannerUrl: string | null;
  firstChapterId: string | null;
}

export default function FeaturedManga({
  mangaId,
  title,
  synopsis,
  bannerUrl,
  firstChapterId,
}: FeaturedMangaProps) {
  return (
    <div
      className="relative max-w-350 mx-auto px-8 py-32 bg-white/5 backdrop-blur-sm rounded-lg shadow-lg bg-cover bg-center"
      style={{ backgroundImage: `url('${bannerUrl ?? "/wide.png"}')` }}
    >
      <div className="flex flex-col gap-3 items-start px-10">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[#b6b0a2] font-mono text-sm">FEATURED MANGA</p>
          <h1 className="text-5xl font-bold text-white max-w-xl">{title}</h1>
        </div>

        <p className="text-[#b6b0a2] max-w-lg mt-6 line-clamp-3">{synopsis}</p>

        <div className="flex gap-4 mt-8">
          {firstChapterId ? (
            <Link
              href={`/manga/titles/${mangaId}/chapter/${firstChapterId}`}
              className="bg-white text-black px-6 py-3 rounded-md hover:bg-white/85 transition-colors duration-200"
            >
              Start Reading
            </Link>
          ) : (
            <span className="bg-white/40 text-black/60 px-6 py-3 rounded-md cursor-not-allowed">
              No chapters yet
            </span>
          )}

          <Link
            href={`/manga/titles/${mangaId}`}
            className="border border-white/20 text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            View Manga
          </Link>
        </div>
      </div>
    </div>
  );
}
