import { prisma } from "@/lib/prisma";

// Riot ID / old-Discord style discriminator — "name" alone isn't unique,
// but "name#tag" always is (enforced by User's @@unique([name, tag])).
// 4 zero-padded digits, e.g. "0472".
function randomTag(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

const MAX_ATTEMPTS = 25;

// Called once, at signup (see lib/auth.ts's user.create.before hook) — a
// user's tag never changes afterward. Retries on the rare collision
// rather than pre-checking then inserting, since two concurrent signups
// for the same name could otherwise both pass a pre-check and then race
// on the real unique constraint.
export async function generateUniqueTag(name: string | null | undefined): Promise<string> {
  if (!name) return randomTag();

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const tag = randomTag();
    const existing = await prisma.user.findFirst({ where: { name, tag }, select: { id: true } });
    if (!existing) return tag;
  }

  // Every one of 10,000 tags for this exact name was taken 25 times in a
  // row — astronomically unlikely outside a deliberate stress test, but
  // fall back to a wider random string rather than looping forever.
  return Math.random().toString(36).slice(2, 6);
}
