import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canModerateComment } from "@/lib/manga-access";

// DELETE /api/admin/comments/[id]/reports — a moderator deciding the
// reports on a comment don't need action: clears them, so the comment
// drops out of the "Reported" filter. Same permission as hide/unhide:
// admins anywhere, authors on comments on their own manga. (Hiding or
// deleting the comment is the other way to act on a report.)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canModerateComment(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { count } = await prisma.commentReport.deleteMany({ where: { comment_id: id } });
  return NextResponse.json({ dismissed: count });
}
