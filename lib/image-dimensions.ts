// Reads width/height straight from a PNG/JPEG/WEBP file's own header
// bytes — no decode, no image-processing dependency. Used server-side in
// /api/upload to reject oversized-resolution uploads (a small file size
// doesn't guarantee reasonable pixel dimensions — a 4000x3000 PNG can be
// under 100KB). Returns null if the format isn't recognized or the header
// is truncated/malformed, which the caller treats as "reject the upload".

export const MAX_IMAGE_DIMENSION = 2000;

export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(bytes: Uint8Array): ImageDimensions | null {
  return readPng(bytes) ?? readJpeg(bytes) ?? readWebp(bytes);
}

function readPng(bytes: Uint8Array): ImageDimensions | null {
  const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 24) return null;
  for (let i = 0; i < SIGNATURE.length; i++) {
    if (bytes[i] !== SIGNATURE[i]) return null;
  }
  // IHDR is required to be the first chunk, immediately after the
  // signature — width/height always sit at this fixed offset.
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16, false), height: view.getUint32(20, false) };
}

function readJpeg(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    // SOF0-SOF15 (minus DHT/JPG/DAC, which share the 0xC0-0xCF range but
    // aren't start-of-frame markers) all carry width/height at the same
    // offset within the segment.
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: view.getUint16(offset + 5, false), width: view.getUint16(offset + 7, false) };
    }
    const segmentLength = view.getUint16(offset + 2, false);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}

function readWebp(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 30) return null;
  const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (!isRiff || !isWebp) return null;

  const chunkId = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (chunkId === "VP8X") {
    // Canvas width/height, each a 24-bit little-endian "value minus one".
    const width = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
    const height = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
    return { width, height };
  }
  if (chunkId === "VP8 ") {
    // Lossy: 3-byte frame tag, then a 3-byte start code (0x9d 0x01 0x2a),
    // then 14-bit width/height (top 2 bits of each 16-bit field are a
    // scale factor, masked off).
    if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) return null;
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  if (chunkId === "VP8L") {
    // Lossless: 1-byte signature (0x2f), then a little-endian 32-bit
    // value packing 14-bit (width-1), 14-bit (height-1), alpha bit,
    // version bits, LSB first.
    if (bytes[20] !== 0x2f) return null;
    const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
  }
  return null;
}
