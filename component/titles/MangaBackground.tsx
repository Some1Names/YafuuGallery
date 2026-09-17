interface MangaBackgroundProps {
  imageUrl?: string;
}

// Full-bleed header backdrop: source image, dark tint, then a fade to the
// page background color at the bottom so content lower on the page doesn't
// fight the image for contrast. Capped to a fixed height (not inset-0
// against the whole page) — every page that renders this is `min-h-screen`
// and grows with its own content, so sizing against the full parent meant
// bg-cover had to re-crop/zoom the image differently depending on how much
// content the page happened to have, which looked like the background
// shifting as a page got taller. Anchoring to a fixed height instead makes
// it behave like a real page-header banner: constant regardless of content
// length below it.
export default function MangaBackground({ imageUrl = "/mangabg.png" }: MangaBackgroundProps) {
  return (
    <div className="absolute inset-x-0 top-0 h-125 md:h-150">
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent" />
    </div>
  );
}
