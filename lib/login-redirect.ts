// "Send me back where I was after signing in": pages that need an account
// redirect to /login?next=<their path>, and the login page returns there on
// success instead of always dumping the reader on the home page.

export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

// Only ever follow a same-site path. `next` arrives from the URL, so
// without this anyone could craft /login?next=https://evil.example (or the
// protocol-relative //evil.example, or /\evil.example, which some browsers
// normalize to //) and bounce a freshly signed-in reader off-site.
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}
