import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Branding for the sign-in pages (login, signup, forgot/reset password).
// The wordmark is the Navbar's: a flat light-gray image made for dark
// backgrounds (see .site-wordmark in globals.css).

// Large screens: the left art panel. /wide.png is white behind the logo
// in either theme, so the wordmark is always inverted to dark here.
export function AuthSidePanel() {
  const t = useTranslations("Common");
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-auth-panel-from via-auth-panel-via to-bg border-r-2 border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/wide.png")' }} />
      <Link href="/" className="relative self-start" aria-label={t("home")}>
        <Image src="/¥afuuGallery.webp" alt="YafuuGallery" width={1529} height={281} priority className="h-10 w-auto invert" />
      </Link>
    </div>
  );
}

// Phones/tablets, where that panel is hidden: the logo in the form
// column's top-left corner (the column must be `relative`), following the
// theme like the Navbar's.
export function AuthMobileLogo() {
  const t = useTranslations("Common");
  return (
    <Link href="/" className="lg:hidden absolute top-6 left-6" aria-label={t("home")}>
      <Image src="/¥afuuGallery.webp" alt="YafuuGallery" width={1529} height={281} priority className="site-wordmark h-6 w-auto" />
    </Link>
  );
}
