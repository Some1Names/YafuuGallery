import { z } from "zod";

// The one display-name rule — used by the signup form AND by profile
// edits (client form + PATCH /api/profile), so a name that couldn't be
// chosen at signup can't be switched to later either.
export const MAX_DISPLAY_NAME_LENGTH = 20;

// Error messages here are KEYS into messages/*.json → Validation (e.g.
// "nameTooShort"), not display text: the same rules run in the signup and
// profile forms and on the server (which returns the key), and each screen
// shows it in the reader's language — see validationMessage().
export const displayNameSchema = z
  .string()
  .trim()
  .min(3, "nameTooShort")
  .max(MAX_DISPLAY_NAME_LENGTH, "nameTooLong")
  .regex(/^[a-zA-Z0-9_]+$/, "nameInvalidChars");

// confirmPassword is typed twice on purpose: until the site can email any
// address (see lib/auth.ts), "forgot password" can't reach most people, so
// a mistyped password at signup would lock them out for good.
export const signupSchema = z
  .object({
    name: displayNameSchema,
    email: z.string().trim().email("emailInvalid"),
    password: z.string().min(8, "passwordTooShort"),
    confirmPassword: z.string().min(1, "confirmRequired"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
