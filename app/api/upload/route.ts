import { NextRequest, NextResponse } from "next/server";
import { ownImageKey, uploadFile } from "@/lib/storage";
import { auth } from "@/auth";
import { getImageDimensions, MAX_IMAGE_DIMENSION } from "@/lib/image-dimensions";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// POST /api/upload — used by ProfileEditForm (avatars) and
// AdminImageUploadButton (manga/arc/chapter covers) to upload an image to
// Cloudflare R2. Requires a signed-in user; the resulting public URL is
// what gets saved on the owning record.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  // A small file size doesn't guarantee reasonable pixel dimensions (a
  // lightly-compressed 4000x3000 PNG can be well under 5MB) — read the
  // dimensions straight out of the file's own header bytes, no decode
  // needed, and cap the resolution too.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = getImageDimensions(bytes);
  if (!dimensions) {
    return NextResponse.json({ error: "Couldn't read image dimensions — the file may be corrupt" }, { status: 400 });
  }
  if (dimensions.width > MAX_IMAGE_DIMENSION || dimensions.height > MAX_IMAGE_DIMENSION) {
    return NextResponse.json(
      { error: `Image too large (max ${MAX_IMAGE_DIMENSION}px on either side)` },
      { status: 400 }
    );
  }

  try {
    const extension = file.type.split("/")[1];
    const url = await uploadFile(`${ownImageKey(session.user.id)}.${extension}`, file);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
