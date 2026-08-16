import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // JWT sessions: no DB read needed on every request, and simpler to reason
  // about than database sessions for a small-to-mid size app. The Session
  // table still exists (adapter requires it) but stays unused with this strategy.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // runs whenever a JWT is created or updated (sign-in, session refresh)
    async jwt({ token, user }) {
      if (user) {
        // `user` is only populated right after sign-in, straight from the DB
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // runs whenever the client asks for the session (e.g. via auth() or useSession())
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "reader" | "author" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});