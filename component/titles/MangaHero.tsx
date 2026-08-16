interface MangaHeroProps {
  imageUrl: string | null;
}

export default function MangaHero({ imageUrl }: MangaHeroProps) {
  return (
    <div
      className="relative w-full h-80 bg-[#ece6d8] bg-cover bg-center rounded-md mb-8 overflow-hidden"
      style={{ backgroundImage: `url('${imageUrl ?? "/wide.png"}')` }}
    />
  );
}
