import { MAX_SYNOPSIS_LENGTH } from "@/lib/content-limits";

// The manga synopsis box (create + edit forms), capped at the same length
// the API enforces, with a live character count under it. Sits in the
// forms' shared label/field grid, so it takes the field column itself.
export default function SynopsisField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  // yellow near the limit; red if somehow over it (typing and pasting stop
  // at maxLength, but the API would refuse an over-long one anyway)
  const isOver = value.length > MAX_SYNOPSIS_LENGTH;
  const isNearLimit = value.length >= MAX_SYNOPSIS_LENGTH * 0.9;
  return (
    <div className="col-span-2 sm:col-span-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        rows={3}
        maxLength={MAX_SYNOPSIS_LENGTH}
        className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg placeholder:text-fg-muted resize-none"
      />
      <p
        className={
          "mt-1 text-right text-xs " + (isOver ? "text-danger-text" : isNearLimit ? "text-warning" : "text-fg-muted")
        }
      >
        {value.length.toLocaleString()} / {MAX_SYNOPSIS_LENGTH.toLocaleString()}
      </p>
    </div>
  );
}
