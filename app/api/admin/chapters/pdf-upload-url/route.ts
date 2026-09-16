import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { canManageManga } from "@/lib/manga-access";
import { getPresignedUploadUrl, publicUrlFor } from "@/lib/storage";

const MAX_SIZE_BYTES = 200 * 1024 * 1024;

// POST /api/admin/chapters/pdf-upload-url — issues a short-lived presigned
// R2 URL for a chapter PDF. The browser uploads directly to R2 with it
// (see AdminPdfUploadButton) instead of sending the file through this
// route, since a 200MB body would blow past Vercel's serverless request
// size limit (~4.5MB) if proxied through a normal API route.
export async function POST(request: NextRequest) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const { manga_id, content_type, file_size } = body ?? {};

  if (!manga_id || !content_type || file_size === undefined || file_size === null) {
    return NextResponse.json(
      { error: "manga_id, content_type, and file_size are required" },
      { status: 400 }
    );
  }

  if (!(await canManageManga(session?.user, manga_id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (content_type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  if (typeof file_size !== "number" || file_size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 200MB)" }, { status: 400 });
  }

  try {
    const key = `chapters/${randomUUID()}.pdf`;
    const uploadUrl = await getPresignedUploadUrl(key, content_type);

    return NextResponse.json({ uploadUrl, publicUrl: publicUrlFor(key) });
  } catch (err) {
    console.error("[POST /api/admin/chapters/pdf-upload-url]", err);
    return NextResponse.json({ error: "Failed to prepare upload." }, { status: 500 });
  }
}
