import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
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
