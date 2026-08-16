interface MangaBackgroundProps {
  imageUrl?: string;
}

// Fixed full-bleed background: source image, dark tint, then a fade to the
// page background color at the bottom so content lower on the page doesn't
// fight the image for contrast.
export default function MangaBackground({ imageUrl = "/mangabg.png" }: MangaBackgroundProps) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent" />
    </>
  );
}
