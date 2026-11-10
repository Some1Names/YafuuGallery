import { describe, expect, it } from "vitest";
import {
  REFRESH_COOLDOWN_MS,
  actionForSide,
  canRefresh,
  onImageError,
  onRetry,
  initialMode,
  preloadTargets,
  shouldPersistMode,
  stepPage,
} from "./reader-state";

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

describe("canRefresh", () => {
  it("allows the first refresh", () => {
    expect(canRefresh(null, 1_000)).toBe(true);
  });

  it("refuses another one inside the cooldown", () => {
    expect(canRefresh(1_000, 1_000 + REFRESH_COOLDOWN_MS - 1)).toBe(false);
  });

  it("allows one again once the cooldown has passed", () => {
    expect(canRefresh(1_000, 1_000 + REFRESH_COOLDOWN_MS)).toBe(true);
  });

  it("has a cooldown of one minute", () => {
    expect(REFRESH_COOLDOWN_MS).toBe(60_000);
  });
});

describe("onImageError", () => {
  const idle = { refreshRunning: false, lastRefreshAt: null };

  it("fetches fresh addresses on the first failure", () => {
    expect(onImageError(idle, 5_000)).toBe("refresh");
  });

  it("queues a failure that arrives while a refresh is running", () => {
    expect(onImageError({ refreshRunning: true, lastRefreshAt: null }, 5_000)).toBe("wait");
  });

  it("marks the page failed inside the cooldown", () => {
    expect(onImageError({ refreshRunning: false, lastRefreshAt: 5_000 }, 5_000 + REFRESH_COOLDOWN_MS - 1)).toBe("fail");
  });

  it("fetches fresh addresses again after the cooldown", () => {
    expect(onImageError({ refreshRunning: false, lastRefreshAt: 5_000 }, 5_000 + REFRESH_COOLDOWN_MS)).toBe("refresh");
  });
});

describe("onRetry", () => {
  it("reloads just that page inside the cooldown", () => {
    expect(onRetry({ refreshRunning: false, lastRefreshAt: 5_000 }, 6_000)).toBe("reload");
  });

  it("reloads just that page while a refresh is running", () => {
    expect(onRetry({ refreshRunning: true, lastRefreshAt: null }, 6_000)).toBe("reload");
  });

  it("fetches fresh addresses once the cooldown has passed", () => {
    expect(onRetry({ refreshRunning: false, lastRefreshAt: 5_000 }, 5_000 + REFRESH_COOLDOWN_MS)).toBe("refresh");
  });
});
