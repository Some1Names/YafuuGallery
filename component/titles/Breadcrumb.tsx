import Link from "next/link";

interface BreadcrumbProps {
  mangaTitle: string;
}

export default function Breadcrumb({ mangaTitle }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 hidden sm:block">
      <ol className="flex items-center gap-2 text-sm text-[#b6b0a2]">
        <li>
          <Link href="/" className="hover:text-[#ece6d8] transition-colors duration-200">
            Home
          </Link>
        </li>
        <li aria-hidden="true">→</li>
        <li aria-current="page" className="text-[#ece6d8] truncate max-w-60">
          {mangaTitle}
        </li>
      </ol>
    </nav>
  );
}
