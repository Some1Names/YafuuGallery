import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createLocalAccountIssuer } from "@better-auth/core/db";
import { prisma } from "@/lib/prisma";
import { APIError } from "better-auth/api";
import { CAN_EMAIL_ANY_ADDRESS, sendEmail } from "@/lib/email";
import { generateUniqueTag } from "@/lib/user-tag";
import { displayNameSchema } from "@/lib/signup-schema";

// Email verification for email/password accounts — switched on
// automatically once the site can email ANY address (CAN_EMAIL_ANY_ADDRESS:
// a verified Resend domain via RESEND_FROM_ADDRESS). Until then it stays
// off: the sandbox sender only reaches the Resend account owner, so
// requiring verification would lock every other new user out.
const EMAIL_VERIFICATION_ENABLED = CAN_EMAIL_ANY_ADDRESS;

export const betterAuthInstance = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Unverified email/password accounts can't sign in once verification
    // is on — the sign-in attempt re-sends the link instead (sendOnSignIn).
    requireEmailVerification: EMAIL_VERIFICATION_ENABLED,
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
  emailVerification: {
    sendOnSignUp: EMAIL_VERIFICATION_ENABLED,
    // an unverified sign-in attempt emails a fresh link, so there's no
    // separate "resend" flow to build or lose track of
    sendOnSignIn: EMAIL_VERIFICATION_ENABLED,
    // clicking the link signs them straight in
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your YafuuGallery email",
        html: `
          <p>Welcome to YafuuGallery! Confirm this is your email address to finish creating your account.</p>
          <p><a href="${url}">Verify my email</a></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
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
      // Better Auth's default refuses to link a Google sign-in onto an
      // UNVERIFIED local account — an account-takeover guard (someone
      // could register your email with their own password first). Only
      // enforced once email verification is actually on: before that, no
      // account can ever become verified by email, so enforcing it would
      // just stop people who signed up with a password from ever also
      // using Google. (Accounts created before verification switches on
      // are marked verified — see the user.create hook and
      // scripts/mark-existing-users-verified.mjs.)
      requireLocalEmailVerified: EMAIL_VERIFICATION_ENABLED,
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
        before: async (user, ctx) => {
          // Email/password signups get the same display-name rule as the
          // signup form and profile edits (lib/signup-schema.ts) —
          // enforced here too, since the form's check only runs in the
          // browser and the signup endpoint can be called directly. Not
          // applied to Google sign-ups: their name comes from Google
          // (possibly with spaces or non-Latin letters) and rejecting it
          // would make Google sign-in fail outright.
          if (ctx?.path === "/sign-up/email") {
            const parsed = displayNameSchema.safeParse(user.name);
            if (!parsed.success) {
              throw new APIError("BAD_REQUEST", { message: parsed.error.issues[0].message });
            }
          }

          const tag = await generateUniqueTag(user.name);
          return {
            data: {
              tag,
              // While verification is off, nothing can verify an email —
              // treat accounts created in that window like the existing
              // ones (grandfathered as verified), so switching verification
              // on later never locks them out. Once it's on, new accounts
              // start unverified as normal.
              ...(!EMAIL_VERIFICATION_ENABLED && { emailVerified: true }),
            },
          };
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
