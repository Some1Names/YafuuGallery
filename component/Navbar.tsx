"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Heart, User, LogIn, LogOut, UserPlus, Search, Compass, History } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { formatUsername } from "@/lib/format-username";
import ThemeToggle from "@/component/ThemeToggle";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/component/LanguageSwitcher";

interface NavbarProps {
  user?: {
    name: string | null;
    tag: string | null;
    image: string | null;
  } | null;
  // Unread new chapters across the viewer's favorites (lib/favorite-updates.ts)
  newChapterCount?: number;
}

const navItems = [
  { href: "/", labelKey: "home", icon: Home },
  // /search with no query is the browse-all listing (genre/status/sort);
  // the search icon on the right goes to the same page, ready to type.
  { href: "/search", labelKey: "browse", icon: Compass },
  { href: "/favorites", labelKey: "favorites", icon: Heart },
] as const;

// Dropdown rows match the bar's plain style: no hover/active background
// boxes, just text brightening on hover, and the current page marked by
// the same 2px ink bar the desktop links use — here on the row's left
// edge instead of underneath.
function menuItemClass(isActive = false) {
  return (
    "relative flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-200 " +
    (isActive ? "text-fg font-medium" : "text-fg-secondary hover:text-fg")
  );
}

// Red "something new" dot beside the Favorites link. The count itself is
// spelled out for screen readers only.
function NewDot({ count, className = "" }: { count: number; className?: string }) {
  const t = useTranslations("Nav");
  return (
    <>
      <span aria-hidden="true" className={"w-2 h-2 rounded-full bg-red-600 " + className} />
      <span className="sr-only">
        {" "}
        {t("newChapters", { count })}
      </span>
    </>
  );
}

function ActiveBar() {
  return <span aria-hidden="true" className="absolute left-0 inset-y-2 w-0.5 bg-fg" />;
}

export default function Navbar({ user, newChapterCount = 0 }: NavbarProps) {
  const t = useTranslations("Nav");
  const hasNew = newChapterCount > 0;
  // With something new, Favorites opens straight on the Updates tab.
  const hrefFor = (href: string) => (href === "/favorites" && hasNew ? "/favorites?tab=updates" : href);

  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  // The dropdowns are disclosure panels (a button toggling a plain list of
  // links), not ARIA menus — so no role="menu" promising arrow-key
  // navigation. They close on an outside click or Escape; Escape also
  // returns focus to the toggle so keyboard users aren't dropped at the
  // top of the page.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAccountMenuOpen(false);
        accountMenuButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isAccountMenuOpen]);

  // Close menus automatically on route change. Done during render (React's
  // "adjusting state when a prop changes" pattern) rather than in an
  // effect, which would paint one frame with the menu still open and then
  // re-render to close it.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  }

  // mobile-only auto-hide: slide the navbar away on scroll-down, bring it
  // back on scroll-up (or near the top), so it doesn't eat screen space on
  // small viewports. Desktop stays pinned visible via `md:translate-y-0`.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (isMenuOpen || isAccountMenuOpen) {
        lastScrollY.current = currentY;
        return;
      }

      if (currentY < 80) {
        setIsHidden(false);
      } else if (delta > 8) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuOpen, isAccountMenuOpen]);

  return (
    <nav
      className={
        "sticky top-0 z-30 bg-nav/75 backdrop-blur border-b-2 border-border transition-transform duration-300 md:translate-y-0 " +
        (isHidden ? "-translate-y-full" : "translate-y-0")
      }
    >
      <div className="max-w-350 mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
        {/* Left: wordmark, then the primary page links (desktop). The link
            row stretches to the full bar height so the active link's ink
            bar can sit exactly on the nav's bottom border. */}
        <div className="flex items-center gap-6 lg:gap-10 self-stretch">
          <Link href="/" className="shrink-0">
            <Image
              src="/¥afuuGallery.webp"
              alt="YafuuGallery"
              width={1529}
              height={281}
              priority
              className="site-wordmark h-5 md:h-9 w-auto mt-1.5"
            />
          </Link>

          <div className="hidden md:flex self-stretch">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={hrefFor(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "relative flex items-center gap-1.5 px-3 text-sm transition-colors duration-200 " +
                    (isActive ? "text-fg font-medium" : "text-fg-secondary hover:text-fg")
                  }
                >
                  {t(item.labelKey)}
                  {item.href === "/favorites" && hasNew && <NewDot count={newChapterCount} />}
                  {/* -bottom-0.5 overlaps the nav's border-b-2 exactly */}
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-fg" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right (desktop): search, theme, account */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/search"
            aria-label={t("search")}
            className={
              "w-9 h-9 flex items-center justify-center transition-colors duration-200 " +
              (pathname === "/search" ? "text-fg" : "text-fg-secondary hover:text-fg")
            }
          >
            <Search className="w-4 h-4" />
          </Link>

          <LanguageSwitcher />
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                ref={accountMenuButtonRef}
                type="button"
                onClick={() => setIsAccountMenuOpen((v) => !v)}
                aria-expanded={isAccountMenuOpen}
                className={
                  "flex items-center gap-2 h-9 pl-1 pr-2.5 ml-1 rounded-md text-sm transition-colors duration-200 " +
                  (pathname === "/profile" || isAccountMenuOpen
                    ? "text-fg bg-surface-hover"
                    : "text-fg-secondary hover:text-fg hover:bg-surface-hover")
                }
              >
                <span className="relative w-7 h-7 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center shrink-0">
                  {user.image ? (
                    <Image src={user.image} alt={user.name ?? t("profile")} fill sizes="32px" className="object-cover" />
                  ) : (
                    <span className="text-xs">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
                  )}
                </span>
                {user.name ? formatUsername(user.name, user.tag) : t("profile")}
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
                  className="absolute right-0 top-full mt-2 w-44 py-1.5 bg-surface border border-border rounded-md shadow-lg overflow-hidden"
                >
                  <Link
                    href="/profile"
                    aria-current={pathname === "/profile" ? "page" : undefined}
                    className={menuItemClass(pathname === "/profile")}
                  >
                    {pathname === "/profile" && <ActiveBar />}
                    {t("profile")}
                  </Link>
                  <Link
                    href="/history"
                    aria-current={pathname === "/history" ? "page" : undefined}
                    className={menuItemClass(pathname === "/history")}
                  >
                    {pathname === "/history" && <ActiveBar />}
                    {t("history")}
                  </Link>
                  <div className="my-1.5 border-t border-border" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={menuItemClass()}
                  >
                    {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center h-9 px-3 ml-1 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="flex items-center h-9 px-4 rounded-md bg-fg text-bg text-sm font-medium hover:bg-fg-hover transition-colors duration-200"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile: search is its own trigger, separate from the menu button
            below (which only opens Home/Browse/Favorites + account) */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/search"
            aria-label={t("search")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-fg-secondary hover:text-fg transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              aria-label={hasNew ? t("menuWithNew", { count: newChapterCount }) : t("menu")}
              className="group relative flex items-center gap-1"
            >
              {/* Favorites lives inside this menu on phones, so the dot
                  shows on the button too. Only signed-in users can have
                  favorites, so this always sits on the avatar. */}
              {hasNew && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 z-10 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-nav"
                />
              )}
              {user ? (
                <span className="relative w-8 h-8 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center shrink-0">
                  {user.image ? (
                    <Image src={user.image} alt={user.name ?? t("profile")} fill sizes="32px" className="object-cover" />
                  ) : (
                    <span className="text-xs text-fg">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
                  )}
                </span>
              ) : (
                <span className="w-8 h-8 flex items-center justify-center text-fg-secondary group-hover:text-fg transition-colors duration-200">
                  {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </span>
              )}
            </button>

            {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 py-1.5 flex flex-col bg-surface border border-border rounded-md shadow-lg overflow-hidden"
            >
              <ThemeToggle variant="menuitem" />
              <LanguageSwitcher variant="menuitem" />

              <div className="my-1.5 border-t border-border" />

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={hrefFor(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={menuItemClass(isActive)}
                  >
                    {isActive && <ActiveBar />}
                    <Icon className="w-4 h-4" />
                    {t(item.labelKey)}
                    {item.href === "/favorites" && hasNew && <NewDot count={newChapterCount} className="ml-auto" />}
                  </Link>
                );
              })}

              <div className="my-1.5 border-t border-border" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    aria-current={pathname === "/profile" ? "page" : undefined}
                    className={menuItemClass(pathname === "/profile")}
                  >
                    {pathname === "/profile" && <ActiveBar />}
                    <User className="w-4 h-4" />
                    {user.name ? formatUsername(user.name, user.tag) : t("profile")}
                  </Link>
                  <Link
                    href="/history"
                    aria-current={pathname === "/history" ? "page" : undefined}
                    className={menuItemClass(pathname === "/history")}
                  >
                    {pathname === "/history" && <ActiveBar />}
                    <History className="w-4 h-4" />
                    {t("history")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={menuItemClass()}
                  >
                    <LogOut className="w-4 h-4" />
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={menuItemClass()}>
                    <LogIn className="w-4 h-4" />
                    {t("signIn")}
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-fg hover:text-fg-hover transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t("signUp")}
                  </Link>
                </>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}