"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isAccountMenuOpen]);

  // close menus automatically on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-30 bg-[#212125]/75 backdrop-blur border-b-2 border-[#050505]">
      <div className="max-w-350 mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-lg tracking-wide text-[#ece6d8] font-(family-name:--font-display)"
        >
          YafuuGallery
        </Link>

        {/* Desktop: inline nav links + profile/sign up, unchanged */}
        <div className="hidden md:flex items-center gap-8">
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

          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((v) => !v)}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className={
                  "flex items-center gap-2 text-sm font-mono transition-colors duration-200 " +
                  (pathname === "/profile" || isAccountMenuOpen
                    ? "text-[#ece6d8]"
                    : "text-[#b6b0a2] hover:text-[#ece6d8]")
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={"transition-transform duration-200 " + (isAccountMenuOpen ? "rotate-180" : "")}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-44 bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg overflow-hidden"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    className={
                      "block px-4 py-2.5 text-sm font-mono transition-colors duration-200 " +
                      (pathname === "/profile" ? "text-[#ece6d8] bg-[#232224]" : "text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8]")
                    }
                  >
                    Profile
                  </Link>
                  <div className="border-t border-[#050505]" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2.5 text-sm font-mono text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8] transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signup"
              className="text-sm font-mono px-3 py-1.5 bg-white hover:bg-white/80 border border-[#050505] rounded text-black transition-colors duration-200"
            >
              Sign up
            </Link>
          )}
        </div>

        {/* Mobile: single trigger (avatar if signed in, else a plain menu
            button) opens a dropdown holding Home/Favorites + account link */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label="Open menu"
            className="flex items-center gap-1"
          >
            {user ? (
              <span className="w-8 h-8 rounded-full overflow-hidden bg-[#1b1a1c] border border-[#050505] flex items-center justify-center shrink-0">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#ece6d8]">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
                )}
              </span>
            ) : (
              <span className="w-8 h-8 rounded-full border border-[#050505] flex items-center justify-center text-[#b6b0a2]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              </span>
            )}
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-48 bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg overflow-hidden"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "block px-4 py-2.5 text-sm font-mono transition-colors duration-200 " +
                      (isActive ? "text-[#ece6d8] bg-[#232224]" : "text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8]")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-[#050505]" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={
                      "block px-4 py-2.5 text-sm font-mono transition-colors duration-200 " +
                      (pathname === "/profile" ? "text-[#ece6d8] bg-[#232224]" : "text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8]")
                    }
                  >
                    {user.name ?? "Profile"}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2.5 text-sm font-mono text-[#b6b0a2] hover:bg-[#232224] hover:text-[#ece6d8] transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/signup"
                  className="block px-4 py-2.5 text-sm font-mono text-[#ece6d8] hover:bg-[#232224] transition-colors duration-200"
                >
                  Sign up
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}