import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";

export default function NotFound() {
  return (
    <StatusScreen badge="404" title="Page not found" message="This page doesn't exist, or the link is broken.">
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        Back to home
      </Link>
    </StatusScreen>
  );
}
