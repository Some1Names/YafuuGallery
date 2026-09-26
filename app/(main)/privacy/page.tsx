import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PrivacyEn } from "./PrivacyEn";
import { PrivacyTh } from "./PrivacyTh";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.privacy");
  return { title: t("title"), description: t("description") };
}

// The policy is one long text per language (PrivacyEn / PrivacyTh) rather
// than a string per sentence — easier to read, review and keep accurate.
export default async function PrivacyPage() {
  return (await getLocale()) === "th" ? <PrivacyTh /> : <PrivacyEn />;
}
