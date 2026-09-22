# Light/Dark Theme — Design

## Goal

Add a user-toggleable light/dark theme to YafuuGallery. Dark is the default and matches the site's current look almost exactly (see the documented exceptions below) for anyone who never touches the toggle. Light is an opt-in alternate palette.

**Addendum (post-implementation, added after the final whole-branch review flagged the original "matches...exactly" wording as self-contradicting the consolidations this same spec calls for):** dark mode is pixel-identical *except* for a small number of deliberate consolidations decided during design/planning, not implementation drift:
- Three near-identical dark-mode hover-text hex variants (`#f6f1f2`/`#f2f0f2`/`#f2f0f0`) were consolidated into one `--color-fg-hover` value — sub-perceptual.
- One near-duplicate hover-surface variant (`#2a292c` in `ProfileEditForm.tsx`) was folded into the existing `--color-surface-hover` token — sub-perceptual.
- `AdminPdfUploadButton`'s dimmer success-green icon (`#4c8f5f`) became `text-success/70` (an opacity modifier on the shared success token) rather than a second hardcoded hex — a small, deliberate, perceptible shift in that one icon's exact shade, traded for not inventing a second green token.
Everything else in dark mode is byte-identical to the pre-theme hex values.

## Scope decisions (confirmed with user)

- **Whole site is themed** — navbar/footer, all public pages (home, search, favorites, manga detail, auth pages), and the admin/manage panels. No dark-only corners.
- **The chapter reader stays dark always.** `ChapterReaderClient` (the fullscreen PDF viewer) does not read the theme at all — it keeps its current hardcoded dark colors unconditionally. Rationale: reading apps conventionally keep the reading surface dark regardless of site theme (avoids a glaring white surround on manga line-art), and it's the most complex, actively-tuned component in the app (swipe/drag/peek physics) — not worth the re-theming risk for a page whose actual content is manga art, not chrome.
- **First visit always starts dark**, regardless of the visitor's OS `prefers-color-scheme`. Light is purely opt-in via the toggle. Once toggled, the choice persists (`localStorage`) across visits.

## Mechanism: CSS custom-property tokens via Tailwind v4 `@theme`

Rejected alternatives:
- **Tailwind's built-in `dark:` variant, used inverted** — would require writing a light value next to every one of the ~600 existing hardcoded-hex occurrences individually (no shared indirection), and inverts the natural reading of `dark:` (present by default, removed for light) in a way that invites mistakes. No benefit over token indirection.
- **React Context / CSS-in-JS theme provider** — this codebase has zero theme/context machinery today; 100% plain Tailwind className strings. Would require touching component logic, not just class strings, for no gain over pure CSS variables (which need zero JS re-render to switch).

Chosen approach: define named color tokens once in `@theme` in `app/globals.css`. Dark values are the defaults (on `:root`); light values are redefined under an `html.light` selector, using the *same token names*. Tailwind v4 auto-generates matching utility classes for any `--color-*` token (e.g. `--color-fg` → `text-fg`, `bg-fg`, `border-fg`, etc.), so every component keeps using plain Tailwind utility classes — just referencing a token name instead of a literal hex — and the browser repaints on class toggle with no React re-render needed anywhere.

## Token set

| Token | Dark (current, unchanged) | Role |
|---|---|---|
| `--color-bg` | `#0a0a0a` | page background |
| `--color-surface` | `#1b1a1c` | card/row background |
| `--color-surface-hover` | `#232224` | hover background |
| `--color-nav` | `#212125` | navbar/footer surface |
| `--color-border` | `#050505` | hairline borders |
| `--color-fg` | `#ece6d8` | primary text |
| `--color-fg-hover` | `#f6f1f2` | brighter hover-state text (consolidates `#f6f1f2`/`#f2f0f2`/`#f2f0f0`, three near-identical dark-mode variants already in the codebase — same token, one value) |
| `--color-fg-secondary` | `#b6b0a2` | secondary text |
| `--color-fg-muted` | `#6b655e` | muted/tertiary text |
| `--color-texture` | `#302e2a` | screentone dot pattern (`NoImagePlaceholder`, `Footer`, `StatusScreen`, `MangaBackground`'s texture layer if any) |

Theme-invariant (same value in both themes, not overridden under `html.light`):
- `--color-danger` = `#9c1d25`
- `--color-success` = `#4ade80` (the dimmer `#4c8f5f` variant in `AdminPdfUploadButton` becomes `text-success` at reduced opacity, e.g. `text-success/70`, rather than a second hardcoded hex)
- `--color-warning` = `#c9a648` (StorageUsageBar's near-limit indicator)

Left as literal Tailwind classes, untouched by the token system entirely:
- Pure `white`/`black` CTA buttons (`bg-white text-black` pattern used across Navbar/FeaturedCarousel/StatusScreen/etc.) — intentionally theme-invariant, not chrome.
- `GoogleIcon`'s four fixed brand colors.

Handled as one-off exceptions during implementation rather than folded into the shared token set:
- The auth pages' (`login`/`signup`/`reset-password`/`forgot-password`) decorative left-panel gradient (`from-[#1e1213] via-[#121113] to-[#0a0a0a]`, plus its `#2a2a2a` Google-button border) — gets its own light-mode gradient value, since it's a one-off decorative panel not reused elsewhere in the app.

## Light palette

"Printed manga page" rather than generic white — warm undertone matching the dark theme's own warm cream/grey family, not a stark white/black inversion.

| Token | Light value | Feel |
|---|---|---|
| `--color-bg` | `#eeeae1` | warm paper, not stark white |
| `--color-surface` | `#fbfaf6` | near-white card, slight lift off the page |
| `--color-surface-hover` | `#f1ede3` | |
| `--color-nav` | `#f7f4ec` | |
| `--color-border` | `#e4ddd0` | soft warm hairline, not harsh black |
| `--color-fg` | `#241f19` | warm ink-brown, not pure black |
| `--color-fg-hover` | `#0f0c09` | |
| `--color-fg-secondary` | `#6b5f4f` | |
| `--color-fg-muted` | `#8f8776` | |
| `--color-texture` | `#ddd5c4` | |

These are first-pass values, to be checked for real contrast (and adjusted live in the browser, not just eyeballed as hex) during implementation — this table is a starting point, not a final spec of exact pixels.

**Addendum (post-implementation): contrast check results.** The final whole-branch review measured WCAG contrast ratios for these values against `--color-bg` and `--color-surface`:

| Pair | Dark ratio | Light ratio | AA (4.5:1) |
|---|---|---|---|
| `fg` on `bg` | 15.91:1 | 13.61:1 | both pass |
| `fg` on `surface` | 13.93:1 | 15.65:1 | both pass |
| `fg-secondary` on `bg` | 9.16:1 | 5.18:1 | both pass |
| `fg-secondary` on `surface` | 8.03:1 | 5.96:1 | both pass |
| `fg-muted` on `bg` | 3.44:1 | 2.97:1 | both fail |
| `fg-muted` on `surface` | 3.01:1 | 3.41:1 | both fail |

`fg-muted` fails AA against both backgrounds in *both* themes — but this is a pre-existing property of the site's muted-text color that predates this feature (82 occurrences across the codebase use it), not something the light palette introduced or worsened. The light values closely mirror dark mode's own contrast profile rather than guessing independently, which was the actual goal of this check. Fixing `fg-muted`'s contrast site-wide is a separate, unrelated task, not part of this theme feature.

## Toggle mechanism

- New `component/ThemeToggle.tsx` (client component): a Sun/Moon icon button (lucide-react, already a dependency) placed in `Navbar` — both the desktop nav row and the mobile menu, next to the existing icon-button conventions there.
- A small theme utility module (e.g. `lib/theme.ts`) exposing `getStoredTheme()`, `setTheme(theme)` — reads/writes `localStorage` and toggles the `light` class on `document.documentElement`. No React Context needed — components never need to know the current theme, they just always reference the same token utility classes.
- **No-flash-of-wrong-theme script**: a small inline `<script dangerouslySetInnerHTML>` (hand-rolled, not the `next-themes` package — confirmed with user), rendered as the very first child of `<body>` in `app/layout.tsx` (before `<RouteProgressBar />` and `{children}`), that synchronously reads `localStorage.theme` and adds the `light` class to `<html>` if present, before anything paints. This runs once per full page load; client-side navigations don't need it since the class persists on the already-mounted `<html>` element.
- `ChapterReaderClient` and everything under `(fullscreen)/viewer` never reference these tokens — untouched, stays hardcoded dark per the scope decision above.

## Rollout / migration strategy

1. Add the token definitions to `app/globals.css` (`@theme` block + `html.light` override block).
2. Build `ThemeToggle` + `lib/theme.ts` + the no-flash script in the root layout. Verify the toggle works on one page first (e.g. the homepage) before touching the rest.
3. Mechanical conversion: a lookup-table-driven pass over all ~50 files replacing each of the ~600 hardcoded hex occurrences with its corresponding token utility class, per the table above. Scriptable since it's a deterministic 1:1 (or 1:few, for the consolidated hover-text variants) mapping.
4. Manual pass over the known one-off exceptions (auth page gradient panel, `AdminPdfUploadButton`'s dimmer green, `GoogleIcon`, CTA buttons) — confirm each is either correctly left untouched or given its own scoped light value.
5. Full visual sweep in both themes: typecheck, lint, then browser verification across representative pages in both themes (home, manga detail, search, favorites, an admin panel page, an auth page) at both desktop and mobile widths, plus confirming the reader is unaffected and the no-flash script actually prevents a flash on a hard reload.

## Testing plan

- `tsc --noEmit` and `eslint` clean after the mechanical conversion (as with every change this session).
- Live browser verification (per the project's established workflow): toggle on/off on several representative pages, confirm no visual regression in dark mode (should be pixel-identical to today), confirm the light palette reads clearly and passes a basic contrast sanity check, confirm the toggle's choice survives a page reload and a client-side navigation, confirm the reader page is unaffected by the toggle in either direction.
