import { describe, expect, it } from "vitest";
import { loginHref, safeNextPath } from "./login-redirect";

describe("safeNextPath", () => {
  it("keeps same-site paths, including query strings", () => {
    expect(safeNextPath("/favorites")).toBe("/favorites");
    expect(safeNextPath("/favorites?tab=updates")).toBe("/favorites?tab=updates");
    expect(safeNextPath("/viewer/abc123")).toBe("/viewer/abc123");
  });

  it("falls back to home when there's nothing to return to", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath("")).toBe("/");
  });

  it("refuses anything that could leave the site", () => {
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("javascript:alert(1)")).toBe("/");
    expect(safeNextPath("evil.example")).toBe("/");
  });
});

describe("loginHref", () => {
  it("encodes the return path so its own query string survives", () => {
    expect(loginHref("/favorites?tab=updates")).toBe("/login?next=%2Ffavorites%3Ftab%3Dupdates");
  });

  it("round-trips through safeNextPath", () => {
    const next = new URLSearchParams(loginHref("/viewer/x?lang=th").split("?")[1]).get("next");
    expect(safeNextPath(next)).toBe("/viewer/x?lang=th");
  });
});
