"use client";

import { useEffect } from "react";
import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";
import { useTranslations } from "next-intl";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("StatusScreen");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      badge="!"
      title={t("errorTitle")}
      message={t("errorMessage")}
      footnote={error.digest ? t("reference", { digest: error.digest }) : undefined}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
      >
        {t("tryAgain")}
      </button>
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        {t("backHome")}
      </Link>
    </StatusScreen>
  );
}
