interface MangaHeroProps {
  imageUrl: string | null;
}

// wide.png (7680x2160) is the standard banner shape — 32:9. Sizing the box
// to that same ratio means a banner cut to spec fills it exactly, while
// bg-contain still keeps anything off-spec fully visible, just letterboxed.
export default function MangaHero({ imageUrl }: MangaHeroProps) {
  return (
    <div
      className="relative w-full aspect-32/9 bg-[#ece6d8] bg-contain bg-no-repeat bg-center rounded-none sm:rounded-md mb-6 sm:mb-14 overflow-hidden"
      style={{ backgroundImage: `url('${imageUrl ?? "/wide.png"}')` }}
    />
  );
}