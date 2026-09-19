import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const browseLinks = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
  { href: "/search", label: "Search" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#212125]">
      {/* Panel gutter: the screentone dot texture from NoImagePlaceholder,
          reused here as the seam between page and footer — manga panels
          are separated by screentone-filled gutters, not blank rules. */}
      <div
        className="h-2"
        style={{
          backgroundColor: "#1b1a1c",
          backgroundImage: "radial-gradient(circle, #302e2a 1px, transparent 1.5px)",
          backgroundSize: "8px 8px",
        }}
      />

      <div className="max-w-350 mx-auto px-6 md:px-8 py-12 flex flex-col gap-10 sm:grid sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl tracking-wide text-[#ece6d8] font-(family-name:--font-display)">
              YafuuGallery
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9c1d25]" aria-hidden="true" />
          </div>
          <p className="text-sm text-[#b6b0a2] mt-3 max-w-60">Scanlations, read your way.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:contents">
          <div>
            <span className="text-xs text-[#6b655e]">Browse</span>
            <ul className="mt-3 flex flex-col gap-2.5">
              {browseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b6b0a2] hover:text-[#ece6d8] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs text-[#6b655e]">Follow</span>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a
                  href="https://www.instagram.com/yafuuyufaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#b6b0a2] hover:text-[#ece6d8] transition-colors duration-200"
                >
                  Instagram
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#050505]">
        <div className="max-w-350 mx-auto px-6 md:px-8 py-5">
          <p className="text-xs text-[#6b655e]">© {year} — By The &quot;ONE&quot; and Only YafuuYufaa.</p>
        </div>
      </div>
    </footer>
  );
}