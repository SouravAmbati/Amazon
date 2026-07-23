import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
});
export const verifyEmailSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email(),

        otp: z
            .string()
            .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    }),
});
export const loginSchema = z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: z
      .string()
      .min(1, "Password is required"),
});