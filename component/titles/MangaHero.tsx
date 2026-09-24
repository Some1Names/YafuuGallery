import NoImagePlaceholder from "@/component/NoImagePlaceholder";

interface MangaHeroProps {
  imageUrl: string | null;
}

// wide.png (7680x2160) is the standard banner shape — 32:9. Sizing the box
// to that same ratio means a banner cut to spec fills it exactly, while
// bg-contain still keeps anything off-spec fully visible, just letterboxed.
// The letterbox is the surface color, not bg-fg: bg-fg is near-white in
// dark mode, which turned an off-spec banner's bars into the brightest
// thing on the page.
export default function MangaHero({ imageUrl }: MangaHeroProps) {
  return (
    <div className="relative w-full aspect-32/9 rounded-none sm:rounded-md mb-6 sm:mb-14 overflow-hidden">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-surface bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      ) : (
        <NoImagePlaceholder />
      )}
    </div>
  );
}