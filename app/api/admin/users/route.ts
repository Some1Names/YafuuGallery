import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { loadUserPage } from "@/lib/admin-lists";

// GET /api/admin/users?q=&cursor= — one page of the admin Users list (see
// lib/admin-lists.ts). Admins only.
export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const page = await loadUserPage({ q: params.get("q") ?? undefined, cursor: params.get("cursor") });
  return NextResponse.json(page);
}
