import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;