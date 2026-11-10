"use client";

import { useEffect } from "react";
import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";
import { useTranslations } from "next-intl";

// Shown when a MangaDex chapter can't be loaded because MangaDex itself
// can't be reached (down, rate-limiting us, timed out, or it returned no
// pages). A chapter that doesn't exist gets the 404 page instead.
export default function ReadError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("Browse");
  const tStatus = useTranslations("StatusScreen");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      badge="!"
      title={t("errorTitle")}
      message={t("errorMessage")}
      footnote={error.digest ? tStatus("reference", { digest: error.digest }) : undefined}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
      >
        {tStatus("tryAgain")}
      </button>
      <Link
        href="/browse"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        {t("backToBrowse")}
      </Link>
    </StatusScreen>
  );
}
