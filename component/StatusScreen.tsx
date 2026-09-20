import type { ReactNode } from "react";
import MangaBackground from "@/component/titles/MangaBackground";

interface StatusScreenProps {
  // Short glyph/code rendered as large display text — "404", "!" — the
  // page's main visual anchor, not a caption.
  badge: string;
  title: string;
  message: string;
  children?: ReactNode;
  // A small aside below the actions — used for the error digest, which is
  // useful to report but not part of the message itself.
  footnote?: string;
  // Root and (fullscreen) render this with no navbar/footer around it, so
  // it needs to own the full viewport height itself. (main) already has
  // both, so it only gets breathing-room padding — a second min-h-screen
  // there would push the footer a full scroll below an otherwise tiny page.
  fullHeight?: boolean;
}

// Shared by every not-found.tsx/error.tsx in the app (root, (main), and
// (fullscreen) each need their own file so Next renders the right layout
// chrome around it — see those files), so the 404/500 states read as part
// of the site rather than a generic framework fallback.
export default function StatusScreen({
  badge,
  title,
  message,
  children,
  footnote,
  fullHeight = true,
}: StatusScreenProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-6 py-20 ${fullHeight ? "min-h-screen" : ""}`}
    >
      <div className="hidden sm:block">
        <MangaBackground fill />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <span className="text-8xl md:text-9xl leading-none tracking-wide text-white font-(family-name:--font-display)">
          {badge}
        </span>
        <h1 className="text-2xl text-[#ece6d8] font-(family-name:--font-display) mt-4">{title}</h1>
        <p className="text-sm text-[#b6b0a2] mt-3">{message}</p>
        {children && <div className="flex items-center gap-4 mt-8">{children}</div>}
        {footnote && <p className="text-xs text-[#6b655e] mt-4">{footnote}</p>}
      </div>
    </div>
  );
}
