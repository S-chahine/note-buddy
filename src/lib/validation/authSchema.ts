import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(v => !/[<>]/.test(v), "Email cannot contain HTML tags")
    .pipe(
      z.email({
        message: "Enter a valid email address.",
      })
    ),
  password: z
  .string()
  .min(1, "Password is required.")
  .refine(v => !/[<>]/.test(v), "Password cannot contain HTML tags"),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(v => !/[<>]/.test(v), "Email cannot contain HTML tags")
    .pipe(
      z.email({
        message: "Enter a valid email address.",
      })
    ),
    
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(64, "Password cannot exceed 64 characters.")
    .refine(v => !/[<>]/.test(v), "Password cannot contain HTML tags"),
});
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(v => !/[<>]/.test(v), "Email cannot contain HTML")
    .pipe(
      z.email({
        message: "Enter a valid email address.",
      })
    ),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters")
    .refine(v => !/[<>]/.test(v), "Password cannot contain HTML"),

  confirm: z.string(),
}).refine(data => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});