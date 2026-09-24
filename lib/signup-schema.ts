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

export const signupSchema = z.object({
  name: displayNameSchema,
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
