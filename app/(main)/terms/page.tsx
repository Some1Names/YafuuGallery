import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { TermsEn } from "./TermsEn";
import { TermsTh } from "./TermsTh";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.terms");
  return { title: t("title"), description: t("description") };
}

// One long text per language (TermsEn / TermsTh), like the privacy policy.
export default async function TermsPage() {
  return (await getLocale()) === "th" ? <TermsTh /> : <TermsEn />;
}
