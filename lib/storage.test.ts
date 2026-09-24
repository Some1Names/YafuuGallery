import { describe, expect, it } from "vitest";
import { isAllowedUrlWrite, keyFromPublicUrl, ownPdfKey, publicUrlFor } from "./storage";

// R2_PUBLIC_URL is set to https://cdn.example.test in vitest.config.ts.
const USER = "user_abc";
const OTHER = "user_xyz";
const UUID = "123e4567-e89b-12d3-a456-426614174000";

const ownImage = publicUrlFor(`uploads/${USER}-1700000000000.webp`);
const ownPdf = publicUrlFor(ownPdfKey(USER, UUID));

describe("keyFromPublicUrl", () => {
  it("extracts the key from one of our public URLs", () => {
    expect(keyFromPublicUrl("https://cdn.example.test/uploads/a.png")).toBe("uploads/a.png");
  });

  it("returns null for anything else", () => {
    expect(keyFromPublicUrl("https://elsewhere.test/uploads/a.png")).toBeNull();
    expect(keyFromPublicUrl("https://cdn.example.test.evil/uploads/a.png")).toBeNull();
    expect(keyFromPublicUrl(null)).toBeNull();
  });
});

// SECURITY: whatever URL gets stored is later DELETED from R2 when the
// record is deleted or the image replaced — so a user may only store
// their own uploads (or leave a field unchanged / clear it).
describe("isAllowedUrlWrite", () => {
  it("allows leaving the field empty or clearing it", () => {
    expect(isAllowedUrlWrite(undefined, USER)).toBe(true);
    expect(isAllowedUrlWrite(null, USER)).toBe(true);
    expect(isAllowedUrlWrite("", USER)).toBe(true);
  });

  it("allows the uploader's own image and PDF uploads", () => {
    expect(isAllowedUrlWrite(ownImage, USER)).toBe(true);
    expect(isAllowedUrlWrite(ownPdf, USER)).toBe(true);
  });

  it("refuses someone else's upload", () => {
    expect(isAllowedUrlWrite(ownImage, OTHER)).toBe(false);
    expect(isAllowedUrlWrite(ownPdf, OTHER)).toBe(false);
  });

  it("allows keeping a value that's already stored, even if not theirs", () => {
    const someoneElses = publicUrlFor(`uploads/${OTHER}-1.png`);
    expect(isAllowedUrlWrite(someoneElses, USER, [someoneElses])).toBe(true);
  });

  it("refuses arbitrary keys in our bucket", () => {
    expect(isAllowedUrlWrite(publicUrlFor("chapters/important.pdf"), USER)).toBe(false);
    expect(isAllowedUrlWrite(publicUrlFor(`uploads/${USER}-1.png/../../secret`), USER)).toBe(false);
    expect(isAllowedUrlWrite(publicUrlFor(`uploads/${USER}-1.svg`), USER)).toBe(false);
  });

  it("doesn't let one user id prefix-match another", () => {
    // "user_abc" must not own "user_abcdef"'s uploads
    expect(isAllowedUrlWrite(publicUrlFor(`uploads/${USER}def-1.png`), USER)).toBe(false);
  });

  it("refuses outside URLs and non-strings", () => {
    expect(isAllowedUrlWrite("https://elsewhere.test/x.png", USER)).toBe(false);
    expect(isAllowedUrlWrite(42, USER)).toBe(false);
    expect(isAllowedUrlWrite({ url: ownImage }, USER)).toBe(false);
  });
});
