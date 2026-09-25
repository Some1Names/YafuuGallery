import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { commentScope, loadCommentPage } from "@/lib/admin-lists";

// GET /api/admin/comments?q=&reported=1&userId=&cursor= — one page of the
// moderation list (see lib/admin-lists.ts). Admins get every comment;
// authors only comments on their own manga (the /manage Comments tab).
export async function GET(request: NextRequest) {
  const session = await auth();
  const scope = commentScope(session?.user);
  if (!scope) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const page = await loadCommentPage({
    scope,
    q: params.get("q") ?? undefined,
    reportedOnly: params.get("reported") === "1",
    userId: params.get("userId") ?? undefined,
    cursor: params.get("cursor"),
  });
  return NextResponse.json(page);
}
