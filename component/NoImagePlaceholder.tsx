interface NoImagePlaceholderProps {
  // Only pass this where the empty state is something to act on (the
  // upload control) — everywhere else (cards, list thumbnails) it's pure
  // display, and repeating "No image" across a whole grid of cards is
  // noise, not information.
  label?: string;
  className?: string;
}

// A screentone dot texture instead of an icon-library glyph — this app's
// own placeholder art (/placeholder.png, /arcimage.png) is already
// hand-drawn manga linework, and screentone sheets are literally what
// manga panels are filled with before the final art goes in. Reads as
// "unfinished panel," not "broken image."
export default function NoImagePlaceholder({ label, className = "" }: NoImagePlaceholderProps) {
  return (
    <div
      // Visible text already carries the meaning where there is one — the
      // aria-label/role is only needed for the purely-visual, textless
      // instances, where a screen reader would otherwise get nothing.
      {...(!label && { role: "img", "aria-label": "No image" })}
      className={`w-full h-full flex items-center justify-center bg-surface ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #302e2a 1px, transparent 1.5px)",
        backgroundSize: "8px 8px",
      }}
    >
      {label && <span className="text-xs text-fg-muted">{label}</span>}
    </div>
  );
}
