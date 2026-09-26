import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// page.tsx here is a client component, which can't export metadata — the
// tab title is set from this pass-through layout instead.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.meta");
  return { title: t("forgot") };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
