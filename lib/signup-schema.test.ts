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
  const valid = { name: "yafuu", email: "a@b.co", password: "12345678", confirmPassword: "12345678" };

  it("requires a valid email and an 8+ character password", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
    expect(signupSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...valid, password: "short", confirmPassword: "short" }).success).toBe(false);
  });

  it("requires the password typed the same twice, and says so on the confirm field", () => {
    const mismatch = signupSchema.safeParse({ ...valid, confirmPassword: "12345679" });
    expect(mismatch.success).toBe(false);
    expect(mismatch.error?.issues[0].path).toEqual(["confirmPassword"]);
    expect(signupSchema.safeParse({ ...valid, confirmPassword: "" }).success).toBe(false);
  });
});
