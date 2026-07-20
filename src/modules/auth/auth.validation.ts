import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters"),

    email: z.email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    profilePhoto: z
      .url("Invalid profile photo URL")
      .optional(),

    role: z.enum(["TENANT", "LANDLORD"]),
  }),
});


const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .email("Invalid email address"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});


export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};