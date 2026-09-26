import type { Metadata } from "next";
import { Inter, Archivo_Black, Noto_Sans_Thai, Kanit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import RouteProgressBar from "@/component/RouteProgressBar";
import DialogHost from "@/component/Dialog";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

// Loaded once here instead of per-page. Inter and Archivo Black have no
// Thai letters, so each gets a Thai partner: globals.css combines them into
// --font-body / --font-display on <body>, Latin face first — Thai text
// falls through to Noto Sans Thai / Kanit glyph by glyph. The Thai files
// only download when a page actually contains Thai (unicode-range).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });
const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"], variable: "--font-thai" });
const kanit = Kanit({ subsets: ["thai"], weight: "700", variable: "--font-thai-display" });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return {
    // Base for any relative URL in metadata (Open Graph images, canonical
    // links) — search engines and link previews need absolute ones.
    metadataBase: new URL(SITE_URL),
    title: {
      default: "YafuuGallery",
      template: "%s | YafuuGallery",
    },
    description: t("description"),
  };
}

// Bare wrapper only — no Navbar here anymore. What renders below this is
// decided per route group: (main)/layout.tsx adds the navbar, (fullscreen)
// deliberately doesn't.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${archivoBlack.variable} ${notoSansThai.variable} ${kanit.variable} bg-bg`}>
        <script
          // Runs before hydration so a returning visitor who chose light mode
          // never sees a flash of dark on load. Vanilla JS only (no imports) —
          // this executes before any bundled code, and localStorage can throw
          // in some contexts (privacy mode, disabled storage), hence the guard.
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{if(window.localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})();',
          }}
        />
        {/* Hands the request's locale + messages (i18n/request.ts) to
            client components' useTranslations */}
        <NextIntlClientProvider>
          <RouteProgressBar />
          {children}
          {/* confirmDialog()/alertDialog() render here, on every page */}
          <DialogHost />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
