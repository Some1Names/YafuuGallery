import type { ReactNode } from "react";
import MangaBackground from "@/component/titles/MangaBackground";

interface StatusScreenProps {
  // Short glyph/code shown inside the screentone badge — "404", "500", "!" —
  // not a caption, just enough to read as intentional rather than broken.
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
// of the site rather than a generic framework fallback. The dot texture is
// the same screentone recipe as NoImagePlaceholder, just scaled up.
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
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
          style={{
            backgroundColor: "#1b1a1c",
            backgroundImage: "radial-gradient(circle, #302e2a 1.5px, transparent 2px)",
            backgroundSize: "10px 10px",
          }}
        >
          <span className="text-2xl tracking-wide text-[#6b655e] font-(family-name:--font-display)">
            {badge}
          </span>
        </div>
        <h1 className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">{title}</h1>
        <p className="text-sm text-[#b6b0a2] mt-3">{message}</p>
        {children && <div className="flex items-center gap-4 mt-8">{children}</div>}
        {footnote && <p className="text-xs text-[#6b655e] mt-4">{footnote}</p>}
      </div>
    </div>
  );
}
