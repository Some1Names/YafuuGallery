"use client";

import { SessionProvider } from "next-auth/react";

// Thin client wrapper — SessionProvider itself needs "use client", but your
// root layout.tsx is a Server Component, so this boundary has to live here
// rather than being added directly to layout.tsx.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
