import { useTranslations } from "next-intl";
// Loading placeholders with the silver shimmer (.shimmer, globals.css) —
// shapes of what's coming instead of a "Loading…" line. Each group is a
// role="status" region with the words kept for screen readers.

function Bar({ className }: { className: string }) {
  return <span className={`shimmer block rounded ${className}`} />;
}

// Reader comment panel: avatar + name + two lines of text, per comment.
export function CommentSkeletons({ count = 3 }: { count?: number }) {
  const t = useTranslations("Skeleton");
  return (
    <div role="status" className="flex flex-col gap-5">
      <span className="sr-only">{t("comments")}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true" className="flex gap-2.5">
          <span className="shimmer w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <Bar className="h-3 w-28" />
            <Bar className="h-3 w-full" />
            <Bar className={`h-3 ${i % 2 ? "w-1/2" : "w-3/4"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Admin/Manage lists (comments, users): bordered rows of text lines.
export function ListRowSkeletons({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <div role="status" className="flex flex-col gap-2 mt-4">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true" className="border border-border rounded-md p-3 flex flex-col gap-2">
          <Bar className="h-3 w-48 max-w-full" />
          <Bar className={`h-3.5 ${i % 2 ? "w-2/3" : "w-5/6"}`} />
        </div>
      ))}
    </div>
  );
}

// Reader: a page-shaped placeholder while the chapter file loads (fixed
// dark colors — the reader is always dark).
export function ReaderPageSkeleton() {
  const t = useTranslations("Skeleton");
  return (
    <div role="status" className="w-full flex justify-center px-0 sm:px-4 py-6">
      <span className="sr-only">{t("chapter")}</span>
      <div aria-hidden="true" className="shimmer shimmer-dark w-full max-w-3xl aspect-[5/7]" />
    </div>
  );
}
