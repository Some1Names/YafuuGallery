interface MangaHeroProps {
  imageUrl: string | null;
}

export default function MangaHero({ imageUrl }: MangaHeroProps) {
  return (
    <div
      className="relative w-full h-56 sm:h-64 md:h-80 bg-[#ece6d8] bg-cover bg-center rounded-none sm:rounded-md mb-6 sm:mb-8 overflow-hidden"
      style={{ backgroundImage: `url('${imageUrl ?? "/wide.png"}')` }}
    />
  );
}