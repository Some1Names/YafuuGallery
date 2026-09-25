import { z } from "zod";

// The one display-name rule — used by the signup form AND by profile
// edits (client form + PATCH /api/profile), so a name that couldn't be
// chosen at signup can't be switched to later either.
export const MAX_DISPLAY_NAME_LENGTH = 20;

export const displayNameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(MAX_DISPLAY_NAME_LENGTH, `Username must be at most ${MAX_DISPLAY_NAME_LENGTH} characters`)
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed");

// confirmPassword is typed twice on purpose: until the site can email any
// address (see lib/auth.ts), "forgot password" can't reach most people, so
// a mistyped password at signup would lock them out for good.
export const signupSchema = z
  .object({
    name: displayNameSchema,
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Type your password again"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
