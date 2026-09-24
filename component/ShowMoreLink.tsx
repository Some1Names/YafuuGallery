import Link from "next/link";

interface ShowMoreLinkProps {
  href: string;
}

// The "Show more" button under a paginated grid (see lib/pagination.ts).
// scroll={false} keeps the reader where they are — the new cards append
// below instead of the page jumping back to the top.
export default function ShowMoreLink({ href }: ShowMoreLinkProps) {
  return (
    <div className="flex justify-center mt-10">
      <Link
        href={href}
        scroll={false}
        className="flex items-center h-11 px-6 rounded-md border border-fg/25 text-fg text-sm font-medium hover:border-fg/60 transition-colors duration-200"
      >
        Show more
      </Link>
    </div>
  );
}
