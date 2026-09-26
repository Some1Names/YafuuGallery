import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("StatusScreen");
  return (
    <StatusScreen badge="404" title={t("notFoundTitle")} message={t("notFoundMessage")}>
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        {t("backHome")}
      </Link>
    </StatusScreen>
  );
}
