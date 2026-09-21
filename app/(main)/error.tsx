"use client";

import { useEffect } from "react";
import Link from "next/link";
import StatusScreen from "@/component/StatusScreen";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      badge="!"
      title="Something broke"
      message="This page failed to load. Try again, or head back home."
      footnote={error.digest ? `Reference: ${error.digest}` : undefined}
      fullHeight={false}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
      >
        Try again
      </button>
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-md text-sm hover:bg-white/85 transition-colors duration-200"
      >
        Back to home
      </Link>
    </StatusScreen>
  );
}
