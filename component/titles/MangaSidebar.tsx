import MangaFavoriteButton from "@/component/titles/MangaFavoriteButton";

interface MangaSidebarProps {
  mangaId: string;
  title: string;
  author: string;
  synopsis: string;
  isFavorited: boolean;
}

export default function MangaSidebar({ mangaId, title, author, synopsis, isFavorited }: MangaSidebarProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-(family-name:--font-display)">{title}</h1>
          <p className="text-[#b6b0a2] text-base sm:text-lg mt-2">{author}</p>
        </div>

        <MangaFavoriteButton mangaId={mangaId} initialFavorited={isFavorited} />
      </div>

      <div className="w-full h-px bg-white/20 my-6 sm:my-8" />

      <p className="text-base leading-relaxed text-[#ece6d8]/90">{synopsis}</p>
    </div>
  );
}