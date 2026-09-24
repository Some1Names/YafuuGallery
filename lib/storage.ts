import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 is Cloudflare's S3-compatible object storage — same PutObjectCommand
// API as AWS S3, just pointed at the account's R2 endpoint instead.
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "";
// Either R2.dev's public bucket URL or a custom domain mapped to the
// bucket — whichever was set up in the Cloudflare dashboard's bucket
// settings under "Public access".
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL ?? "";

export async function uploadFile(key: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return publicUrlFor(key);
}

// For large files (chapter PDFs, up to 200MB) a Vercel serverless function
// can't proxy the upload — request bodies there are capped around 4.5MB.
// Instead the browser uploads the bytes straight to R2 using a short-lived
// presigned PUT URL, and the Next.js server never sees the file at all.
export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}

export function publicUrlFor(key: string): string {
  return `${PUBLIC_URL_BASE}/${key}`;
}

// Reverses publicUrlFor — lets the admin dashboard attribute an R2 object
// back to the manga/chapter/arc/user row whose *_url column stored it.
export function keyFromPublicUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith(`${PUBLIC_URL_BASE}/`)) return null;
  return url.slice(PUBLIC_URL_BASE.length + 1);
}

// Upload keys carry the uploader's user id, so ownership can be checked
// from the URL alone: /api/upload writes uploads/<userId>-<ms>.<ext>, and
// /api/admin/chapters/pdf-upload-url writes chapters/<userId>-<uuid>.pdf.
export function ownImageKey(userId: string): string {
  return `uploads/${userId}-${Date.now()}`;
}
export function ownPdfKey(userId: string, uuid: string): string {
  return `chapters/${userId}-${uuid}.pdf`;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isOwnUploadKey(key: string, userId: string): boolean {
  const id = escapeRegExp(userId);
  return (
    new RegExp(`^uploads/${id}-\\d+\\.(png|jpeg|webp)$`).test(key) ||
    new RegExp(`^chapters/${id}-[0-9a-f-]{36}\\.pdf$`).test(key)
  );
}

// SECURITY — gate for every client-supplied *_url written to the database.
// Stored URLs get DELETED from R2 when they're later replaced
// (deleteReplacedUrls) or their row is deleted (deleteUrls). If a client
// could write ANY URL, a user could point their own record at someone
// else's file (another manga's cover, a chapter PDF — all public URLs) and
// then replace/delete their record to make the server delete that file;
// or store an off-site URL that next/image refuses to render, breaking
// every page showing it. So a write is only allowed to:
//   - clear the field (null/undefined/""),
//   - keep a value the record already holds (`currentValues` — including
//     legacy values like a Google avatar or a seeded /public path), or
//   - reference one of THIS user's own uploads.
export function isAllowedUrlWrite(
  next: unknown,
  userId: string,
  currentValues: (string | null | undefined)[] = []
): boolean {
  if (next === undefined || next === null || next === "") return true;
  if (typeof next !== "string") return false;
  if (currentValues.includes(next)) return true;
  const key = keyFromPublicUrl(next);
  return key !== null && isOwnUploadKey(key, userId);
}

// R2's S3-compatible API has no "bucket size" endpoint — the object-scoped
// credentials this app holds can't reach Cloudflare's account-level
// analytics API either (see AdminImageUploadButton's CORS-check history),
// so the only way to total storage is listing every object and summing
// Size. Paginated via ContinuationToken since ListObjectsV2 caps a single
// page at 1000 keys.
export async function getObjectSizes(): Promise<Map<string, number>> {
  const sizes = new Map<string, number>();
  let continuationToken: string | undefined;

  do {
    const page = await r2.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: continuationToken })
    );

    for (const obj of page.Contents ?? []) {
      if (obj.Key) sizes.set(obj.Key, obj.Size ?? 0);
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  return sizes;
}

export async function getStorageUsage(): Promise<{ bytesUsed: number; objectCount: number }> {
  const sizes = await getObjectSizes();
  let bytesUsed = 0;
  for (const size of sizes.values()) bytesUsed += size;
  return { bytesUsed, objectCount: sizes.size };
}

// DeleteObjectsCommand caps a single call at 1000 keys — chunked the same
// way ListObjectsV2's pagination is, so this stays correct even once the
// bucket has more orphaned objects than that.
export async function deleteObjects(keys: string[]): Promise<void> {
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: chunk.map((Key) => ({ Key })) },
      })
    );
  }
}

// Called after a PATCH route successfully swaps a *_url column to a new
// value — deletes whatever the column pointed at before, so a re-upload
// stops leaving its predecessor as an orphan for UnattributedStorage to
// catch later. `newUrl: undefined` means the field wasn't part of this
// update at all (the route's own conditional-spread convention) and is
// left alone; `null`/a same-URL replacement/no previous value are all
// no-ops too.
export async function deleteReplacedUrls(
  pairs: { oldUrl: string | null; newUrl: string | null | undefined }[]
): Promise<void> {
  const keys: string[] = [];
  for (const { oldUrl, newUrl } of pairs) {
    if (newUrl === undefined || !oldUrl || oldUrl === newUrl) continue;
    const key = keyFromPublicUrl(oldUrl);
    if (key) keys.push(key);
  }
  if (keys.length > 0) await deleteObjects(keys);
}

// Called after a DELETE route removes a row (and, via the schema's own
// cascades, everything under it) — every *_url this row and its cascaded
// children held is now unreachable, no "did it change" comparison needed.
export async function deleteUrls(urls: (string | null | undefined)[]): Promise<void> {
  const keys: string[] = [];
  for (const url of urls) {
    const key = keyFromPublicUrl(url);
    if (key) keys.push(key);
  }
  if (keys.length > 0) await deleteObjects(keys);
}
