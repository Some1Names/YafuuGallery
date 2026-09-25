import Link from "next/link";
import { GENRES, MANGA_STATUSES } from "@/lib/genres";
import ActiveChipScroller from "@/component/search/ActiveChipScroller";
import SortDropdown from "@/component/search/SortDropdown";
import { searchHref, type SearchFilters } from "@/lib/search-filters";

interface SearchFilterBarProps {
  filters: SearchFilters;
}

function chipClass(isOn: boolean) {
  return (
    "inline-block whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors duration-200 " +
    (isOn
      ? "border-fg bg-fg text-bg font-medium"
      : "bg-surface border-border text-fg-secondary hover:text-fg hover:border-fg-secondary")
  );
}

// One segment of the status pill: the current choice is filled with ink,
// the others are plain text inside the shared rounded outline.
function segmentClass(isOn: boolean) {
  return (
    "flex items-center h-full px-3.5 rounded-full text-sm whitespace-nowrap transition-colors duration-200 " +
    (isOn ? "bg-fg text-bg font-medium" : "text-fg-secondary hover:text-fg")
  );
}

// Genre / status / sort for /search. Every option is a plain link to the
// filtered URL (see lib/search-filters.ts), so filtering works with JS
// off, and each view can be shared. Changing any filter drops ?page, so
// the list starts again from the top. scroll={false} keeps the bar where
// it is instead of jumping to the top of the page on every tap.
export default function SearchFilterBar({ filters }: SearchFilterBarProps) {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col gap-4">
      {/* One scrolling row on phones (bleeds to the screen edges so the
          chips visibly continue), wrapping onto more lines from sm up. */}
      <ActiveChipScroller
        activeKey={filters.genre ?? ""}
        className="-mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none]"
      >
        <ul className="flex gap-2 sm:flex-wrap w-max sm:w-auto">
          <li>
            <Link
              href={searchHref({ ...filters, genre: null })}
              scroll={false}
              aria-current={filters.genre === null ? "true" : undefined}
              className={chipClass(filters.genre === null)}
            >
              All genres
            </Link>
          </li>
          {GENRES.map((g) => {
            const isOn = filters.genre === g.slug;
            return (
              <li key={g.slug}>
                <Link
                  // tapping the current genre again clears it
                  href={searchHref({ ...filters, genre: isOn ? null : g.slug })}
                  scroll={false}
                  aria-current={isOn ? "true" : undefined}
                  className={chipClass(isOn)}
                >
                  {g.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </ActiveChipScroller>

      {/* Status as a segmented pill on the left, sort as a dropdown on the
          right. Phones: the two don't fit on one line, so sort moves up
          beside the results heading instead (search/page.tsx). */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Status"
          className="flex items-center h-9 p-0.5 rounded-full border border-border bg-surface"
        >
          {[{ value: null, label: "All" }, ...MANGA_STATUSES].map((s) => {
            const isOn = filters.status === s.value;
            return (
              <Link
                key={s.label}
                href={searchHref({ ...filters, status: s.value })}
                scroll={false}
                aria-current={isOn ? "true" : undefined}
                className={segmentClass(isOn)}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:block">
          <SortDropdown filters={filters} />
        </div>
      </div>
    </div>
  );
}
