import { describe, expect, it } from "vitest";
import { coverUpstreamUrl } from "./cover";

const M = "a1c7c817-4e59-43b7-9365-09675a149a6f";
const F = "2f4aca53-64c7-46ac-ae85-3bc9b3169890.png";

describe("coverUpstreamUrl", () => {
  it("builds the 256 thumbnail URL by default", () => {
    expect(coverUpstreamUrl(M, F, null)).toBe(`https://uploads.mangadex.org/covers/${M}/${F}.256.jpg`);
  });

  it("accepts size 512", () => {
    expect(coverUpstreamUrl(M, F, "512")).toBe(`https://uploads.mangadex.org/covers/${M}/${F}.512.jpg`);
  });

  it("treats any other size as 256", () => {
    expect(coverUpstreamUrl(M, F, "9999")).toMatch(/\.256\.jpg$/);
    expect(coverUpstreamUrl(M, F, "512/../x")).toMatch(/\.256\.jpg$/);
  });

  it("rejects a manga id that is not a uuid", () => {
    expect(coverUpstreamUrl("x", F, null)).toBeNull();
    expect(coverUpstreamUrl("..", F, null)).toBeNull();
  });

  it.each(["../../secret.png", "a.png", F + "/x", F.replace(".png", ".svg"), "http://evil/" + F, F + "?x=1", ""])(
    "rejects file name %j",
    (fileName) => {
      expect(coverUpstreamUrl(M, fileName, null)).toBeNull();
    },
  );
});
