import { headers } from "next/headers";
import { betterAuthInstance } from "@/lib/auth";

// Thin compatibility wrapper so every existing `import { auth } from "@/auth"`
// call site — there are ~13 of them across app/** — keeps working unchanged
// against Better Auth's session API, which has a different shape/signature.
export async function auth() {
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
}
