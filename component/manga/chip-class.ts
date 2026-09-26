// The toggle-chip look shared by the manga forms' choice rows (Status,
// Genres, Reading direction). Its own module, not exported from one of
// those components — a component file that also exports a helper makes
// Fast Refresh reload the whole page on every edit instead of hot-swapping.
export function chipClass(isOn: boolean) {
  return (
    "text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 " +
    (isOn
      ? "border-fg bg-fg text-bg font-medium"
      : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
  );
}
