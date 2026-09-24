interface MangaBackgroundProps {
  imageUrl?: string;
  // Fixed h-125/md:h-150 by default, sized as a page-header banner. Pass
  // true to instead fill whatever height the (already `relative`) parent
  // has — for shorter or variable-height contexts (e.g. StatusScreen),
  // where the fixed height would either overflow or clip the fade before
  // it reaches the bottom.
  fill?: boolean;
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
//
// The image itself is faded (opacity-40) so it reads as a texture behind
// the page's own banner/art rather than a second busy image competing with
// it. The black tint above it is unchanged — that's what keeps the white
// page headers legible in both themes.
export default function MangaBackground({ imageUrl = "/mangabg.png", fill = false }: MangaBackgroundProps) {
  return (
    <div className={fill ? "absolute inset-0" : "absolute inset-x-0 top-0 h-125 md:h-150"}>
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg to-transparent" />
    </div>
  );
}
