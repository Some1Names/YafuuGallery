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
      <h1 className="text-5xl mt-1 font-(family-name:--font-display)">{title}</h1>
      <p className="text-[#b6b0a2] text-lg mt-2">{author}</p>

      <div className="w-full h-px bg-white/20 my-8" />

      <p className="text-base leading-relaxed max-w-md mb-5 text-[#ece6d8]/90">{synopsis}</p>

      <MangaFavoriteButton mangaId={mangaId} initialFavorited={isFavorited} />
    </div>
  );
}