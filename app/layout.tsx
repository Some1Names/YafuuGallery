import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-[#0a0a0a]">{children}</body>
    </html>
  );
}