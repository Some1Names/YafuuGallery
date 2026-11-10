"use client";

import { useEffect } from "react";
import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";
import { useTranslations } from "next-intl";

// Shown when MangaDex can't be reached (down, rate-limiting us, timed
// out) anywhere under /browse. Only this zone depends on MangaDex — the
// message says so, so a reader doesn't think the whole site is broken.
export default function BrowseError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
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
      fullHeight={false}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
      >
        {tStatus("tryAgain")}
      </button>
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        {tStatus("backHome")}
      </Link>
    </StatusScreen>
  );
}
