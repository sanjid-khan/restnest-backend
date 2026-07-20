import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(255)
      .optional(),

    email: z.email().optional(),

    profilePhoto: z.url().optional(),

    bio: z
      .string()
      .max(500)
      .optional(),
  }),
});


export const UserValidation = {
  updateProfileValidationSchema,
};



