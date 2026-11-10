import { describe, expect, it } from "vitest";
import { actionForSide, initialMode, preloadTargets, shouldPersistMode, stepPage } from "./reader-state";

describe("initialMode", () => {
  it("is always vertical for a long strip", () => {
    expect(initialMode("horizontal", true)).toBe("vertical");
  });

  it("uses a valid saved value", () => {
    expect(initialMode("horizontal", false)).toBe("horizontal");
    expect(initialMode("vertical", false)).toBe("vertical");
  });

  it("falls back to vertical, like the PDF reader", () => {
    expect(initialMode("junk", false)).toBe("vertical");
    expect(initialMode(null, false)).toBe("vertical");
  });
});

describe("shouldPersistMode", () => {
  it("is false for a long strip, true otherwise", () => {
    expect(shouldPersistMode(true)).toBe(false);
    expect(shouldPersistMode(false)).toBe(true);
  });
});

describe("stepPage", () => {
  it("moves one page", () => {
    expect(stepPage(3, 10, "forward")).toBe(4);
    expect(stepPage(3, 10, "back")).toBe(2);
  });

  it("stops at the first page", () => {
    expect(stepPage(1, 10, "back")).toBe(1);
  });

  it("goes one past the last page, to the end panel, and no further", () => {
    expect(stepPage(10, 10, "forward")).toBe(11);
    expect(stepPage(11, 10, "forward")).toBe(11);
    expect(stepPage(11, 10, "back")).toBe(10);
  });
});

describe("actionForSide", () => {
  it("manga (rtl): left is forward, right is back", () => {
    expect(actionForSide("left", "rtl")).toBe("forward");
    expect(actionForSide("right", "rtl")).toBe("back");
  });

  it("comic (ltr): right is forward, left is back", () => {
    expect(actionForSide("right", "ltr")).toBe("forward");
    expect(actionForSide("left", "ltr")).toBe("back");
  });
});

describe("preloadTargets", () => {
  it("is the next two pages", () => {
    expect(preloadTargets(1, 10)).toEqual([2, 3]);
  });

  it("stops at the last page", () => {
    expect(preloadTargets(9, 10)).toEqual([10]);
    expect(preloadTargets(10, 10)).toEqual([]);
    expect(preloadTargets(11, 10)).toEqual([]);
  });
});
