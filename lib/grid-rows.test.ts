import { describe, expect, it } from "vitest";
import { fullRowCount } from "./grid-rows";

describe("fullRowCount", () => {
  it("drops the items that would sit in a partly filled last row", () => {
    expect(fullRowCount(3, 2)).toBe(2);
    expect(fullRowCount(5, 2)).toBe(4);
    expect(fullRowCount(4, 3)).toBe(3);
    expect(fullRowCount(5, 3)).toBe(3);
  });

  it("keeps everything when the rows are already full", () => {
    expect(fullRowCount(4, 2)).toBe(4);
    expect(fullRowCount(6, 3)).toBe(6);
  });

  it("keeps a single short row as it is", () => {
    expect(fullRowCount(0, 2)).toBe(0);
    expect(fullRowCount(1, 2)).toBe(1);
    expect(fullRowCount(2, 3)).toBe(2);
  });
});
