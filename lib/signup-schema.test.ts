import { describe, expect, it } from "vitest";
import { displayNameSchema, signupSchema } from "./signup-schema";

describe("displayNameSchema", () => {
  it("accepts 3–20 letters, numbers and underscores", () => {
    expect(displayNameSchema.safeParse("abc").success).toBe(true);
    expect(displayNameSchema.safeParse("user_123").success).toBe(true);
    expect(displayNameSchema.safeParse("a".repeat(20)).success).toBe(true);
  });

  it("trims before checking", () => {
    expect(displayNameSchema.parse("  yafuu  ")).toBe("yafuu");
  });

  it("rejects names that are too short, too long, or use other characters", () => {
    expect(displayNameSchema.safeParse("ab").success).toBe(false);
    expect(displayNameSchema.safeParse("a".repeat(21)).success).toBe(false);
    expect(displayNameSchema.safeParse("has space").success).toBe(false);
    expect(displayNameSchema.safeParse("admin#0001").success).toBe(false);
    expect(displayNameSchema.safeParse("<script>").success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("requires a valid email and an 8+ character password", () => {
    expect(signupSchema.safeParse({ name: "yafuu", email: "a@b.co", password: "12345678" }).success).toBe(true);
    expect(signupSchema.safeParse({ name: "yafuu", email: "nope", password: "12345678" }).success).toBe(false);
    expect(signupSchema.safeParse({ name: "yafuu", email: "a@b.co", password: "short" }).success).toBe(false);
  });
});
