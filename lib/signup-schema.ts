import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;