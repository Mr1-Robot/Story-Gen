import { z } from "zod";

// SIGN IN SCHEMA
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// SIGN UP SCHEMA
export const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    name: z
      .string()
      .min(2, "Name is required. Minimum 2 character(s)")
      .max(14, "Name must be at most 14 character(s)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 character(s)")
      .max(32, "Password must be at most 32 character(s)"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 character(s)")
      .max(32, "Password must be at most 32 character(s)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
