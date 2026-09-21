import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import RouteProgressBar from "@/component/RouteProgressBar";
import "./globals.css";

// Loaded once here instead of per-page — every page and component gets
// --font-body/--font-display for free via the CSS variables on <body>.
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "YafuuGallery",
    template: "%s | YafuuGallery",
  },
  description:
    "Read original manga, explore stories, and follow every chapter.",
};

// Bare wrapper only — no Navbar here anymore. What renders below this is
// decided per route group: (main)/layout.tsx adds the navbar, (fullscreen)
// deliberately doesn't.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${archivoBlack.variable} bg-bg`}>
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
        <RouteProgressBar />
        {children}
      </body>
    </html>
  );
}