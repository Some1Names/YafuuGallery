"use client";

import { useEffect, useRef } from "react";

// On phones the genre chips are one sideways-scrolling row, so a genre
// picked from further along (or arrived at from a manga page's genre
// link) can sit off-screen with nothing showing it's selected. Scrolls the
// row itself (not the page) so the current chip is in view. Re-runs on
// every navigation that changes the selection.
export default function ActiveChipScroller({
  activeKey,
  className,
  children,
}: {
  activeKey: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = ref.current;
    const chip = row?.querySelector<HTMLElement>("[aria-current]");
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left >= rowBox.left && chipBox.right <= rowBox.right) return;
    row.scrollLeft += chipBox.left - rowBox.left - (rowBox.width - chipBox.width) / 2;
  }, [activeKey]);

  return (
    <nav ref={ref} aria-label="Genre" className={className}>
      {children}
    </nav>
  );
}
