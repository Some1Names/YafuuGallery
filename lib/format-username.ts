// "name" alone isn't unique (see User.tag in schema.prisma) — this is the
// one place that decides how "name#tag" gets displayed, so every call
// site stays consistent if the format ever changes.
export function formatUsername(name: string | null | undefined, tag: string | null | undefined): string {
  if (!name) return "Unknown";
  return tag ? `${name}#${tag}` : name;
}
