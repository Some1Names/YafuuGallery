import type { Metadata } from "next";

// page.tsx here is a client component, which can't export metadata — the
// tab title is set from this pass-through layout instead.
export const metadata: Metadata = { title: "Reset password" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
