import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createLocalAccountIssuer } from "@better-auth/core/db";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateUniqueTag } from "@/lib/user-tag";

export const betterAuthInstance = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your YafuuGallery password",
        html: `
          <p>Someone requested a password reset for your YafuuGallery account.</p>
          <p><a href="${url}">Click here to reset your password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Google's id token already carries the first name separately
      // (given_name) — using that instead of splitting `name` on a space
      // also gets this right for people with multi-word first names.
      // Falls back to a plain space-split only if given_name is ever
      // missing. Image is left alone; only the name gets shortened.
      mapProfileToUser: (profile) => ({
        name: profile.given_name || profile.name.split(" ")[0],
      }),
    },
  },
  account: {
    accountLinking: {
      // There's no email-verification flow in this app yet, so every
      // email/password account has emailVerified: false. Better Auth's
      // default refuses to link a social sign-in onto an unverified local
      // account (an account-takeover guard) — without this, anyone who
      // already made an email/password account could never also sign in
      // with Google using the same address. Since Google itself verifies
      // the email on its end, that's an acceptable trade for now; revisit
      // if/when real email verification is added.
      requireLocalEmailVerified: false,
      // Copy Google's name/profile picture onto the local account the
      // first time it links (brand-new Google sign-ups already get this
      // for free — this covers linking Google onto an existing
      // email/password account, e.g. someone who signed up with a
      // password and later hits "Continue with Google"). Only runs once,
      // at link time, so it won't clobber a custom avatar on every
      // subsequent login.
      updateUserInfoOnLink: true,
    },
  },
  user: {
    // keep using the existing snake_case columns/enum instead of adding
    // duplicate camelCase ones — `role` stays the Prisma `Role` enum;
    // better-auth only needs to know it as a plain string at this layer
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "reader",
        input: false,
      },
      // Assigned once at signup by the user.create hook below — never
      // user-editable, so this is read-only from every client the same
      // way `role` is.
      tag: {
        type: "string",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // "name" alone isn't unique — this assigns the "#0472"-style
        // discriminator that, combined with name, is (User's
        // @@unique([name, tag])). Runs for both credential and Google
        // sign-ups, since both create the User row through this same
        // hook; for Google, mapProfileToUser above has already set
        // `user.name` by the time this fires.
        before: async (user) => {
          const tag = await generateUniqueTag(user.name);
          return { data: { tag } };
        },
      },
    },
    account: {
      create: {
        // Better Auth is supposed to always populate `issuer` itself
        // (createLocalAccountIssuer for email/password, an OAuth issuer URL
        // for social sign-ins) — the Account model's `issuer` column is
        // required specifically so two different auth methods can never be
        // confused for the same account. In production this has been
        // observed arriving empty for brand-new credential (email/password)
        // sign-ups, which throws mid-signup and leaves an orphaned User row
        // with no working password — the account "exists" but can never log
        // in. This guarantees the value regardless of why the built-in path
        // drops it, without touching accounts that already have one (e.g.
        // Google, which sets its own issuer).
        before: async (account) => {
          if (!account.issuer && account.providerId === "credential") {
            return { data: { issuer: createLocalAccountIssuer("credential") } };
          }
        },
      },
    },
  },
  // must be last — patches Better Auth's cookie handling for Next.js's
  // App Router (Server Actions / Route Handlers) cookie APIs
  plugins: [nextCookies()],
});
