import { cache } from "react";
import { headers } from "next/headers";
import { betterAuthInstance } from "@/lib/auth";

// Thin compatibility wrapper so every existing `import { auth } from "@/auth"`
// call site — there are ~13 of them across app/** — keeps working unchanged
// against Better Auth's session API, which has a different shape/signature.
//
// Wrapped in React's cache() so the ~2-13 calls that can happen in a single
// request (root layout's navbar, plus whichever page also needs the
// session) dedupe into one session lookup instead of one per call — cache()
// scopes its memoization to a single render pass, so this never leaks a
// session across requests or users.
export const auth = cache(async () => {
  const session = await betterAuthInstance.api.getSession({ headers: await headers() });
  if (!session) return null;

  return {
    user: {
      id: session.user.id,
      name: session.user.name as string | null,
      email: session.user.email,
      image: session.user.image as string | null,
      role: session.user.role as "reader" | "author" | "admin",
    },
  };
});
