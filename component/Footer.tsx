import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[#050505] bg-[#212125] mt-20">
      <div className="max-w-350 mx-auto px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-lg tracking-wide text-[#ece6d8] font-(family-name:--font-display)">
            YafuuGallery
          </span>
          <p className="text-xs text-[#b6b0a2] font-mono mt-1">
            © {year} — By The "ONE" and Only YafuuYufaa.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#b6b0a2] hover:text-[#ece6d8] font-mono transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
