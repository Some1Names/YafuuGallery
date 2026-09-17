// Client-side (browser-only — canvas, Image, Blob) pipeline that runs on
// every picked file before it's uploaded: center-crops to the target box's
// aspect ratio (so object-cover's runtime cropping is a no-op, not a
// surprise) and downscales/re-encodes as WebP, stepping the quality down
// until it's comfortably under the target byte size. This replaces the old
// behavior of just rejecting anything over MAX_IMAGE_DIMENSION with 2000px
// on a side — most phone photos are well past that — by fixing oversized
// uploads instead of bouncing them back to the user.

import { MAX_IMAGE_DIMENSION } from "@/lib/image-dimensions";

const TARGET_MAX_BYTES = 1.5 * 1024 * 1024; // 1.5MB
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55, 0.45];

export interface ProcessImageOptions {
  // width / height, e.g. 2 / 3 for a poster cover. Omit to keep the
  // source image's own aspect ratio (just capped/compressed, not cropped).
  aspectRatio?: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

// Largest centered rect matching targetRatio that fits inside a
// sourceWidth x sourceHeight image — the standard "crop to fit" rect, used
// as the canvas draw's source rectangle so the crop and the resize happen
// in the same drawImage call instead of two passes.
function centeredCropRect(sourceWidth: number, sourceHeight: number, targetRatio: number) {
  const sourceRatio = sourceWidth / sourceHeight;
  if (sourceRatio > targetRatio) {
    // Source is wider than the target ratio — crop the sides.
    const width = sourceHeight * targetRatio;
    return { sx: (sourceWidth - width) / 2, sy: 0, sWidth: width, sHeight: sourceHeight };
  }
  // Source is taller than (or equal to) the target ratio — crop top/bottom.
  const height = sourceWidth / targetRatio;
  return { sx: 0, sy: (sourceHeight - height) / 2, sWidth: sourceWidth, sHeight: height };
}

// Picks output pixel dimensions that preserve the crop rect's aspect ratio
// while capping the longer side at MAX_IMAGE_DIMENSION — never upscales a
// smaller source.
function targetDimensions(cropWidth: number, cropHeight: number) {
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(cropWidth, cropHeight));
  return { width: Math.round(cropWidth * scale), height: Math.round(cropHeight * scale) };
}

export async function processImageForUpload(file: File, options: ProcessImageOptions = {}): Promise<File> {
  const img = await loadImage(file);
  const { naturalWidth, naturalHeight } = img;

  const crop = options.aspectRatio
    ? centeredCropRect(naturalWidth, naturalHeight, options.aspectRatio)
    : { sx: 0, sy: 0, sWidth: naturalWidth, sHeight: naturalHeight };

  const { width, height } = targetDimensions(crop.sWidth, crop.sHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, crop.sx, crop.sy, crop.sWidth, crop.sHeight, 0, 0, width, height);

  // Re-encode at decreasing quality until it's under the target size —
  // stops at the first step that fits, or falls back to the smallest
  // (last) step tried if none of them get there (an very high-detail
  // image at the size cap can still land a bit over; that's fine, it's
  // already far smaller than the untouched original would have been).
  let blob: Blob | null = null;
  for (const quality of QUALITY_STEPS) {
    blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= TARGET_MAX_BYTES) break;
  }
  if (!blob) throw new Error("Couldn't process image");

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
