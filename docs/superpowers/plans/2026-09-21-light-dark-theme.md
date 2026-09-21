# Light/Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a user-toggleable light/dark theme to YafuuGallery, dark as the default with zero visual change until the user opts into light.

**Architecture:** Define ~15 semantic color tokens as CSS custom properties in `app/globals.css` using Tailwind v4's `@theme inline` (dark values on `:root`, light values redefined under `html.light`), so every component just uses ordinary Tailwind utility classes (`bg-surface`, `text-fg`, etc.) instead of literal hex. A hand-rolled no-flash script sets the class from `localStorage` before first paint. A one-time Node codemod script does the mechanical hex→token replacement across the codebase; a handful of one-off exceptions (decorative auth-page gradient, a dimmer accent green, inline-style hex, the fixed-brand Google icon) are converted by hand.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, TypeScript, lucide-react (already a dependency, used for the Sun/Moon icons). No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-09-21-light-dark-theme-design.md`

## Global Constraints

- Dark is the default look and must be **pixel-identical** to the current site for anyone who never touches the toggle.
- Whole site is themed (public pages, admin/manage panels, navbar/footer, auth pages) **except** the chapter reader (`component/titles/ChapterReaderClient.tsx`), which stays hardcoded dark and must never be touched by the conversion script.
- First visit (no stored preference) always starts dark, regardless of OS `prefers-color-scheme`.
- No new npm dependencies (hand-rolled no-flash script, not `next-themes`).
- Every task ends with `npx tsc --noEmit` and `npx eslint <touched files>` clean, plus a live browser check (this project has no automated test framework — `tsc`/`eslint`/browser verification is its established test cycle; see the spec).
- The 3 accent tokens (`--color-danger`, `--color-success`, `--color-warning`) use the **same value in both themes** — no `html.light` override entry for them.

---

## File Structure

| File | Responsibility |
|---|---|
| `app/globals.css` | Modify: defines all theme tokens (dark defaults + light overrides), removes dead `--background`/`--foreground` boilerplate |
| `lib/theme.ts` | Create: `Theme` type, `getStoredTheme()`, `setTheme()` — the only code that touches `localStorage` or toggles the `light` class |
| `app/layout.tsx` | Modify: adds the no-flash inline script as the first child of `<body>`; converts its own `bg-[#0a0a0a]` to `bg-bg` |
| `component/ThemeToggle.tsx` | Create: Sun/Moon toggle button, client component, uses `lib/theme.ts` |
| `component/Navbar.tsx` | Modify: converted to tokens, mounts `ThemeToggle` in desktop nav + mobile menu |
| `component/Footer.tsx` | Modify: converted to tokens (including its inline-style screentone gutter) |
| `scripts/convert-theme-tokens.mjs` | Create: one-time Node codemod, not part of the runtime app — converts `bg-[#hex]`-style Tailwind arbitrary values to token utility classes across `app/` and `component/`, skipping `ChapterReaderClient.tsx` |
| `component/NoImagePlaceholder.tsx` | Modify (manual): inline-style hex → `var(--color-texture)` |
| `component/admin/AdminPdfUploadButton.tsx` | Modify (manual): `text-[#4c8f5f]` → `text-success/70` |
| `app/(fullscreen)/login/page.tsx`, `signup/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx` | Modify (manual): decorative left-panel gradient → `--color-auth-panel-from`/`--color-auth-panel-via` tokens |

---

### Task 1: Theme tokens in `app/globals.css` + root layout background

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx:26`

**Interfaces:**
- Produces: CSS custom properties `--color-bg`, `--color-surface`, `--color-surface-hover`, `--color-nav`, `--color-border`, `--color-fg`, `--color-fg-hover`, `--color-fg-secondary`, `--color-fg-muted`, `--color-texture`, `--color-danger`, `--color-success`, `--color-warning`, `--color-auth-panel-from`, `--color-auth-panel-via` — and matching Tailwind utilities (`bg-bg`, `text-fg`, `border-border`, `bg-surface-hover`, etc.), consumed by every later task.

- [ ] **Step 1: Replace the dead demo tokens with the real theme tokens**

Edit `app/globals.css` — replace everything from the top through the `body { ... }` block (i.e. everything before the `/* Fill animation for the featured carousel's active dot */` comment) with:

```css
@import "tailwindcss";

:root {
  --color-bg: #0a0a0a;
  --color-surface: #1b1a1c;
  --color-surface-hover: #232224;
  --color-nav: #212125;
  --color-border: #050505;
  --color-fg: #ece6d8;
  --color-fg-hover: #f6f1f2;
  --color-fg-secondary: #b6b0a2;
  --color-fg-muted: #6b655e;
  --color-texture: #302e2a;
  --color-danger: #9c1d25;
  --color-success: #4ade80;
  --color-warning: #c9a648;
  --color-auth-panel-from: #1e1213;
  --color-auth-panel-via: #121113;
}

html.light {
  --color-bg: #eeeae1;
  --color-surface: #fbfaf6;
  --color-surface-hover: #f1ede3;
  --color-nav: #f7f4ec;
  --color-border: #e4ddd0;
  --color-fg: #241f19;
  --color-fg-hover: #0f0c09;
  --color-fg-secondary: #6b5f4f;
  --color-fg-muted: #8f8776;
  --color-texture: #ddd5c4;
  --color-auth-panel-from: #f7f4ec;
  --color-auth-panel-via: #f2ede2;
}

@theme inline {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-surface-hover: var(--color-surface-hover);
  --color-nav: var(--color-nav);
  --color-border: var(--color-border);
  --color-fg: var(--color-fg);
  --color-fg-hover: var(--color-fg-hover);
  --color-fg-secondary: var(--color-fg-secondary);
  --color-fg-muted: var(--color-fg-muted);
  --color-texture: var(--color-texture);
  --color-danger: var(--color-danger);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-auth-panel-from: var(--color-auth-panel-from);
  --color-auth-panel-via: var(--color-auth-panel-via);
}

body {
  font-family: var(--font-body), Arial, Helvetica, sans-serif;
}
```

This removes the unused `--background`/`--foreground` demo tokens and their `@media (prefers-color-scheme: dark)` override (confirmed via grep that nothing in `app`/`component` references `bg-background`/`text-foreground`), since `body`'s background now comes from the `bg-bg` Tailwind class on `<body>` in `app/layout.tsx` (Step 2) instead of a plain-CSS rule — having both would be two competing sources of truth for the same property.

- [ ] **Step 2: Point the root layout's body background at the new token**

Edit `app/layout.tsx:26` — change:

```tsx
<body className={`${inter.variable} ${archivoBlack.variable} bg-[#0a0a0a]`}>
```

to:

```tsx
<body className={`${inter.variable} ${archivoBlack.variable} bg-bg`}>
```

- [ ] **Step 3: Verify Tailwind compiles the new tokens and the page is visually unchanged**

Run: `npx tsc --noEmit` — expect no output (clean).

Start the dev server (`preview_start` with the `dev` config, or `bun run dev` / `npm run dev`), open the homepage, and in the browser console run:

```js
getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
```

Expected: `"#0a0a0a"`. Then run:

```js
document.documentElement.classList.add('light');
getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
```

Expected: `"#eeeae1"`. Take a screenshot — the page should look **identical** to before (nothing consumes these tokens visually yet except `<body>`'s own background, which should now visibly shift to the warm paper color while the `light` class is present). Remove the class again (`document.documentElement.classList.remove('light')`) before moving on.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "Add light/dark theme color tokens"
```

---

### Task 2: Theme persistence utility + no-flash script

**Files:**
- Create: `lib/theme.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing (foundational).
- Produces: `type Theme = "light" | "dark"`, `getStoredTheme(): Theme | null`, `setTheme(theme: Theme): void` from `lib/theme.ts` — consumed by `ThemeToggle` in Task 3.

- [ ] **Step 1: Create the theme persistence utility**

Create `lib/theme.ts`:

```ts
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function setTheme(theme: Theme): void {
  window.localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.classList.toggle("light", theme === "light");
}
```

- [ ] **Step 2: Add the no-flash script to the root layout**

Edit `app/layout.tsx`. Change the `<body>` block from:

```tsx
<body className={`${inter.variable} ${archivoBlack.variable} bg-bg`}>
  <RouteProgressBar />
  {children}
</body>
```

to:

```tsx
<body className={`${inter.variable} ${archivoBlack.variable} bg-bg`}>
  <script
    // Runs before hydration so a returning visitor who chose light mode
    // never sees a flash of dark on load. Vanilla JS only (no imports) —
    // this executes before any bundled code, and localStorage can throw
    // in some contexts (privacy mode, disabled storage), hence the guard.
    dangerouslySetInnerHTML={{
      __html:
        '(function(){try{if(window.localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})();',
    }}
  />
  <RouteProgressBar />
  {children}
</body>
```

- [ ] **Step 3: Verify the persistence utility and no-flash script**

Run: `npx tsc --noEmit` — expect clean. Run: `npx eslint lib/theme.ts app/layout.tsx` — expect clean.

In the browser console on the running dev server:

```js
localStorage.setItem("theme", "light");
```

Reload the page (a hard reload, not client-side navigation). Immediately after reload, before anything else runs, check:

```js
document.documentElement.classList.contains("light")
```

Expected: `true`. Take a screenshot right after reload — `<body>`'s background should already be the light paper color with no visible flash of dark first (the effect will be subtle right now since only `<body>` consumes the token so far — full visual proof comes in Task 3). Then clean up:

```js
localStorage.removeItem("theme");
document.documentElement.classList.remove("light");
```

- [ ] **Step 4: Commit**

```bash
git add lib/theme.ts app/layout.tsx
git commit -m "Add theme persistence utility and no-flash script"
```

---

### Task 3: Conversion script + ThemeToggle, piloted on Navbar and Footer

**Files:**
- Create: `scripts/convert-theme-tokens.mjs`
- Create: `component/ThemeToggle.tsx`
- Modify: `component/Navbar.tsx`
- Modify: `component/Footer.tsx`

**Interfaces:**
- Consumes: `getStoredTheme`, `setTheme` from `lib/theme.ts` (Task 2); the CSS tokens from Task 1.
- Produces: `component/ThemeToggle.tsx` default export (no props) — consumed by `Navbar.tsx`. `scripts/convert-theme-tokens.mjs` — consumed (re-run) by Task 4.

- [ ] **Step 1: Write the conversion script**

Create `scripts/convert-theme-tokens.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = ["app", "component"];

// Files that must never be touched — the reader stays hardcoded dark
// regardless of the site theme (see the design spec).
const EXCLUDE_FILES = new Set([
  path.join("component", "titles", "ChapterReaderClient.tsx"),
]);

// Every hex value currently used as chrome/text/accent color, mapped to
// its token name. A few dark-mode-only near-duplicate variants
// (#2a292c, #f2f0f2, #f2f0f0) are folded into an existing token rather
// than kept as separate one-off colors.
const HEX_TO_TOKEN = {
  "0a0a0a": "bg",
  "1b1a1c": "surface",
  "232224": "surface-hover",
  "2a292c": "surface-hover",
  "212125": "nav",
  "050505": "border",
  "ece6d8": "fg",
  "f6f1f2": "fg-hover",
  "f2f0f2": "fg-hover",
  "f2f0f0": "fg-hover",
  "b6b0a2": "fg-secondary",
  "6b655e": "fg-muted",
  "302e2a": "texture",
  "9c1d25": "danger",
  "4ade80": "success",
  "c9a648": "warning",
};

// Matches an optional chain of variants (hover:, sm:, group-hover:, etc.),
// then a Tailwind color-utility prefix, then the arbitrary hex value in
// brackets — e.g. "hover:bg-[#232224]" or "sm:text-[#ece6d8]".
const CLASS_RE =
  /((?:[\w-]+:)*(?:bg|text|border|from|via|to|ring|divide|outline|decoration|fill|stroke|caret|accent|shadow))-\[#([0-9a-fA-F]{6})\]/g;

function convertFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const updated = original.replace(CLASS_RE, (match, prefixChain, hex) => {
    const token = HEX_TO_TOKEN[hex.toLowerCase()];
    if (!token) return match; // leave one-off colors for manual handling
    changed = true;
    return `${prefixChain}-${token}`;
  });
  if (changed) fs.writeFileSync(filePath, updated, "utf8");
  return changed;
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (entry.isFile() && (full.endsWith(".tsx") || full.endsWith(".ts"))) {
      results.push(full);
    }
  }
}

const files = [];
for (const dir of TARGET_DIRS) walk(path.join(ROOT, dir), files);

let touchedCount = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (EXCLUDE_FILES.has(rel)) continue;
  if (convertFile(file)) {
    touchedCount += 1;
    console.log(`converted: ${rel}`);
  }
}
console.log(`\nDone. ${touchedCount} files changed.`);
```

- [ ] **Step 2: Pilot-run the script on just Navbar and Footer**

Run:

```bash
node scripts/convert-theme-tokens.mjs
```

This converts every eligible file in `app/` and `component/`, not just the two this task cares about — that's fine, it's the same script Task 4 needs to run anyway. Check `git diff component/Navbar.tsx component/Footer.tsx` to confirm every `[#hex]` class became a token class (e.g. `bg-[#1b1a1c]` → `bg-surface`, `hover:text-[#ece6d8]` → `hover:text-fg`).

Then discard the script's changes to every file *except* those two, so Task 4 can do a clean, reviewable run of its own later:

```bash
git status --short | awk '{print $2}' | grep -v -E "^(component/Navbar\.tsx|component/Footer\.tsx)$" | xargs -r git checkout --
```

Confirm with `git status --short` that only `component/Navbar.tsx` and `component/Footer.tsx` show as modified.

- [ ] **Step 3: Handle Footer's inline-style screentone gutter (the one thing the script can't reach)**

The script only rewrites Tailwind class strings, not inline `style={{...}}` objects. In `component/Footer.tsx`, find:

```tsx
style={{
  backgroundColor: "#1b1a1c",
  backgroundImage: "radial-gradient(circle, #302e2a 1px, transparent 1.5px)",
  backgroundSize: "8px 8px",
}}
```

and change it to:

```tsx
style={{
  backgroundColor: "var(--color-surface)",
  backgroundImage: "radial-gradient(circle, var(--color-texture) 1px, transparent 1.5px)",
  backgroundSize: "8px 8px",
}}
```

- [ ] **Step 4: Build the theme toggle**

Create `component/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(getStoredTheme() ?? "dark");
  }, []);

  function handleToggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="text-fg-secondary hover:text-fg transition-colors duration-200"
    >
      {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
```

This reads the stored theme in an effect (not during render) specifically so server-rendered HTML always matches the "dark" default and there's no hydration mismatch — the no-flash script from Task 2 already set the right class on `<html>` before paint; this effect only syncs the icon/label to match what's already on the page.

- [ ] **Step 5: Mount the toggle in Navbar**

In `component/Navbar.tsx`, add the import:

```tsx
import ThemeToggle from "@/component/ThemeToggle";
```

In the desktop nav row (the `hidden md:flex items-center gap-8` div), add `<ThemeToggle />` next to the existing `Search` icon link, before it:

```tsx
<div className="hidden md:flex items-center gap-8">
  <ThemeToggle />
  <Link
    href="/search"
    ...
```

In the mobile menu dropdown (the `role="menu"` div with `navItems.map`), add it as its own row above the nav items:

```tsx
<div
  role="menu"
  className="absolute right-0 top-full mt-2 w-44 flex flex-col bg-surface border border-border rounded-md shadow-lg overflow-hidden"
>
  <div className="flex items-center justify-center px-4 py-2.5 border-b border-border">
    <ThemeToggle />
  </div>
  {navItems.map((item) => {
    ...
```

This element's own `className` (originally `"absolute right-0 top-full mt-2 w-44 flex flex-col bg-[#1b1a1c] border border-[#050505] rounded-md shadow-lg overflow-hidden"`) was already rewritten to the `bg-surface`/`border-border` form shown above by Step 2's script run — this step only inserts the new toggle row as a child, it doesn't touch that className string itself.

- [ ] **Step 6: Verify end-to-end, visually, in the browser**

Run: `npx tsc --noEmit` and `npx eslint component/Navbar.tsx component/Footer.tsx component/ThemeToggle.tsx` — expect both clean.

Start the dev server, open the homepage. Scroll to see both Navbar and Footer. Take a screenshot (dark, current state — should look identical to before this task). Click the new toggle button. Take a screenshot — Navbar and Footer should now show the warm paper light palette; nothing else on the page should change yet (that's expected — the rest of the site hasn't been converted). Reload the page — confirm it stays light (persistence) and Navbar/Footer render light immediately with no flash of dark. Click the toggle again to switch back to dark, reload, confirm it stays dark.

- [ ] **Step 7: Commit**

```bash
git add scripts/convert-theme-tokens.mjs component/ThemeToggle.tsx component/Navbar.tsx component/Footer.tsx
git commit -m "Add theme toggle, piloted on Navbar and Footer"
```

---

### Task 4: Run the conversion across the rest of the codebase

**Files:**
- Modify: every remaining `.tsx`/`.ts` file under `app/` and `component/` that contains one of the mapped hex values, except `component/titles/ChapterReaderClient.tsx` (excluded by the script) and `component/Navbar.tsx`/`component/Footer.tsx` (already converted in Task 3 — re-running is a safe no-op on them).

**Interfaces:**
- Consumes: `scripts/convert-theme-tokens.mjs` from Task 3.
- Produces: nothing new — this task's deliverable is the converted files themselves.

- [ ] **Step 1: Run the script again against the whole codebase**

```bash
node scripts/convert-theme-tokens.mjs
```

- [ ] **Step 2: Review the diff**

```bash
git status --short
git diff --stat
```

Expect roughly 45-50 files changed. Spot-check a handful of the diffs (`git diff component/admin/AdminDashboard.tsx`, `git diff component/titles/ChapterRow.tsx`, `git diff app/(fullscreen)/login/page.tsx`) to confirm every converted class looks correct (e.g. `bg-[#1b1a1c]` → `bg-surface`, `hover:bg-[#232224]` → `hover:bg-surface-hover`) and that no unrelated text was touched (chapter badge strings like `"#001"` are plain JSX text, not inside a `-[#...]` class pattern, so the regex can't match them — confirm none were altered).

Confirm `component/titles/ChapterReaderClient.tsx` shows **no changes** (`git diff component/titles/ChapterReaderClient.tsx` should be empty).

- [ ] **Step 3: Typecheck and lint the whole project**

```bash
npx tsc --noEmit
npx eslint .
```

Expect both clean, other than the pre-existing `react-hooks/set-state-in-effect` warnings already present before this work started (in `ChapterReaderClient.tsx`, `ChapterCommentPanel.tsx`, `MangaCard.tsx`, `Navbar.tsx`, `AdminArcList.tsx`, `AdminChapterList.tsx`, `StorageUsageBar.tsx`, `RecentSearches.tsx`) — confirm the count and locations of any remaining lint errors match that pre-existing set exactly, with nothing new introduced.

- [ ] **Step 4: Commit**

```bash
git add app component
git commit -m "Convert remaining hardcoded colors to theme tokens"
```

---

### Task 5: Manual one-off exceptions

**Files:**
- Modify: `component/NoImagePlaceholder.tsx`
- Modify: `component/admin/AdminPdfUploadButton.tsx`
- Modify: `app/(fullscreen)/login/page.tsx`
- Modify: `app/(fullscreen)/signup/page.tsx`
- Modify: `app/(fullscreen)/forgot-password/page.tsx`
- Modify: `app/(fullscreen)/reset-password/page.tsx`

**Interfaces:**
- Consumes: `--color-texture`, `--color-success`, `--color-auth-panel-from`, `--color-auth-panel-via`, `--color-border` tokens from Task 1.
- Produces: nothing new — closes out every color the script deliberately left untouched.

- [ ] **Step 1: Convert NoImagePlaceholder's inline-style texture**

In `component/NoImagePlaceholder.tsx`, change:

```tsx
style={{
  backgroundImage: "radial-gradient(circle, #302e2a 1px, transparent 1.5px)",
  backgroundSize: "8px 8px",
}}
```

to:

```tsx
style={{
  backgroundImage: "radial-gradient(circle, var(--color-texture) 1px, transparent 1.5px)",
  backgroundSize: "8px 8px",
}}
```

- [ ] **Step 2: Convert AdminPdfUploadButton's dimmer success green**

In `component/admin/AdminPdfUploadButton.tsx`, change:

```tsx
<CheckCircle2 className="w-4 h-4 text-[#4c8f5f] shrink-0" />
```

to:

```tsx
<CheckCircle2 className="w-4 h-4 text-success/70 shrink-0" />
```

- [ ] **Step 3: Give the auth pages' decorative panel a light-mode gradient**

In each of `app/(fullscreen)/login/page.tsx`, `signup/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`, find the left-panel gradient:

```tsx
bg-linear-to-b from-[#1e1213] via-[#121113] to-[#0a0a0a]
```

and change it to:

```tsx
bg-linear-to-b from-auth-panel-from via-auth-panel-via to-bg
```

Also in the same files, find the Google sign-in button's border:

```tsx
border-[#2a2a2a]
```

and change it to:

```tsx
border-border
```

(These four files were already converted by Task 4's script for every *other* color they contain — e.g. `#ece6d8` → `fg`, `#1b1a1c` → `surface` — this step only touches the specific classes the script's lookup table deliberately excluded.)

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npx eslint component/NoImagePlaceholder.tsx component/admin/AdminPdfUploadButton.tsx "app/(fullscreen)/login/page.tsx" "app/(fullscreen)/signup/page.tsx" "app/(fullscreen)/forgot-password/page.tsx" "app/(fullscreen)/reset-password/page.tsx"` — expect clean.

In the browser: visit `/login` in dark mode, screenshot the left panel (should look unchanged from before this whole feature started). Toggle light mode (via the Navbar toggle, or `localStorage.setItem("theme","light")` + reload), revisit `/login`, screenshot — the left panel should now show the warm paper gradient instead of a jarring leftover near-black panel against an otherwise light page. Visit a page with a missing manga cover (or `/manga/titles/<any-id>` with a manga that has no `cover_image_url`) in both themes to confirm `NoImagePlaceholder`'s screentone texture adapts. Check an admin page with an upload showing the green checkmark (`AdminPdfUploadButton`) in both themes.

- [ ] **Step 5: Commit**

```bash
git add component/NoImagePlaceholder.tsx component/admin/AdminPdfUploadButton.tsx "app/(fullscreen)/login/page.tsx" "app/(fullscreen)/signup/page.tsx" "app/(fullscreen)/forgot-password/page.tsx" "app/(fullscreen)/reset-password/page.tsx"
git commit -m "Handle remaining one-off colors (auth gradient, texture, dimmer green)"
```

---

### Task 6: Full visual sweep and production build check

**Files:** none (verification only).

**Interfaces:** none — this task consumes everything from Tasks 1-5 and produces no new code.

- [ ] **Step 1: Sweep representative pages in both themes**

Start the dev server. For each of: home (`/`), search (`/search`), favorites (`/favorites`), a manga detail page (`/manga/titles/<id>`), an admin page (`/admin`), and an auth page (`/login`) —

1. View it in dark mode (default), screenshot.
2. Toggle to light mode via the Navbar button, screenshot.
3. Check `read_console_messages` for errors on each.

Confirm: dark-mode screenshots look identical to how these pages looked before this feature (no regressions from the mechanical conversion), and light-mode screenshots show the warm paper palette consistently — no leftover jarring dark patches, no illegible low-contrast text.

- [ ] **Step 2: Confirm the reader is completely unaffected**

With the site in light mode (toggle it on from the homepage), navigate to any `/viewer/<chapterId>` page. Confirm it renders exactly as dark as always — check `document.documentElement.classList.contains("light")` returns `true` (the class is still there) while the reader's own hardcoded colors are visually unaffected, proving `ChapterReaderClient.tsx` truly never reads the theme.

- [ ] **Step 3: Confirm no flash-of-wrong-theme on a hard reload**

With `light` saved in `localStorage`, do a hard reload (not client-side navigation) on the homepage. Screenshot immediately. There should be no visible frame of dark before light appears — the inline script in Task 2 runs before first paint.

- [ ] **Step 4: Mobile check**

Using `resize_window` with the `mobile` preset, repeat the dark/light toggle check on the homepage and one manga detail page. Reset to `desktop` preset afterward.

- [ ] **Step 5: Production build**

```bash
npx next build
```

Expect a clean build with no new errors (the same pre-existing Better Auth `BETTER_AUTH_URL` warnings from earlier in this project's history are expected and unrelated).

- [ ] **Step 6: Final commit (if anything was adjusted during the sweep)**

```bash
git add -A
git commit -m "Polish light/dark theme after full visual sweep"
```

(Skip this step if Step 1-5 found nothing to fix — the feature is already fully committed via Tasks 1-5.)
