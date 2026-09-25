import { describe, expect, it } from "vitest";
import { checkText } from "./content-limits";

describe("checkText", () => {
  it("returns the trimmed value when it fits", () => {
    expect(checkText("  Nocturne Bakery  ", "Title", 100)).toEqual({ value: "Nocturne Bakery" });
    expect(checkText("a".repeat(100), "Title", 100)).toEqual({ value: "a".repeat(100) });
  });

  it("rejects text over the limit (counted after trimming)", () => {
    expect(checkText("a".repeat(101), "Title", 100)).toEqual({ error: "Title must be 100 characters or fewer." });
    expect(checkText(` ${"a".repeat(100)} `, "Title", 100)).toEqual({ value: "a".repeat(100) });
  });

  it("rejects missing, blank or non-text values", () => {
    for (const bad of [undefined, null, "", "   ", 42, ["x"], { x: 1 }]) {
      expect(checkText(bad, "Synopsis", 2000)).toEqual({ error: "Synopsis is required." });
    }
  });
});
