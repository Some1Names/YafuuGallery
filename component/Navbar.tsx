"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user?: {
    name: string | null;
    image: string | null;
  } | null;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 bg-[#212023]/75 backdrop-blur border-b-2 border-[#27262a]">
      <div className="max-w-350 mx-auto px-8 h-18 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-lg tracking-wide text-[#ece6d8] font-(family-name:--font-display)"
        >
          YafuuGallery
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm font-mono transition-colors duration-200 " +
                  (isActive ? "text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]")
                }
              >
                {item.label}
              </Link>
            );
          })}

          {/* Profile / Sign up */}
          {user ? (
            <Link
              href="/profile"
              className={
                "flex items-center gap-2 text-sm font-mono transition-colors duration-200 " +
                (pathname === "/profile" ? "text-[#ece6d8]" : "text-[#b6b0a2] hover:text-[#ece6d8]")
              }
            >
              <span className="w-7 h-7 rounded-full overflow-hidden bg-[#1b1a1c] border border-[#050505] flex items-center justify-center shrink-0">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
                )}
              </span>
              {user.name ?? "Profile"}
            </Link>
          ) : (
            <Link
              href="/signup"
              className="text-sm font-mono px-3 py-1.5 bg-white hover:bg-white/80 border border-[#050505] rounded text-black transition-colors duration-200"
            >
              Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}