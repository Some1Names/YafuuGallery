// One-off: mark every existing account's email as verified, so switching on
// email verification (lib/auth.ts — automatic once RESEND_FROM_ADDRESS is
// set) never locks out anyone who signed up before it existed. New accounts
// created while verification is still off are grandfathered the same way by
// the user.create hook, so this only needs running once; running it again
// is harmless.
//
// Dry run by default (prints who would change); pass --apply to write.
//   node --env-file=.env scripts/mark-existing-users-verified.mjs
//   node --env-file=.env scripts/mark-existing-users-verified.mjs --apply

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

try {
  const unverified = await prisma.user.findMany({
    where: { emailVerified: false },
    select: { id: true, name: true, tag: true, created_at: true },
    orderBy: { created_at: "asc" },
  });

  console.log(`${unverified.length} account(s) not marked verified.`);
  for (const u of unverified) {
    console.log(`  ${u.name ?? "(no name)"}#${u.tag ?? "????"} — joined ${u.created_at.toISOString().slice(0, 10)}`);
  }

  if (unverified.length === 0) {
    console.log("Nothing to do.");
  } else if (!apply) {
    console.log("Dry run — nothing written. Re-run with --apply to mark these verified.");
  } else {
    const { count } = await prisma.user.updateMany({ where: { emailVerified: false }, data: { emailVerified: true } });
    console.log(`Marked ${count} account(s) verified.`);
  }
} finally {
  await prisma.$disconnect();
}
