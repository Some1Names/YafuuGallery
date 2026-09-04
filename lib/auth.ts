import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const betterAuthInstance = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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
    },
  },
  // must be last — patches Better Auth's cookie handling for Next.js's
  // App Router (Server Actions / Route Handlers) cookie APIs
  plugins: [nextCookies()],
});
