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
    <html lang="en">
      <body className={`${inter.variable} ${archivoBlack.variable} bg-bg`}>
        <RouteProgressBar />
        {children}
      </body>
    </html>
  );
}