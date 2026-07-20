import { z } from "zod";
import { RentalRequestStatus } from "../../../generated/prisma/enums";

const createRentalRequestValidationSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),

    moveInDate: z.coerce.date(),

    message: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

const updateRentalRequestValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      Object.values(RentalRequestStatus) as [string, ...string[]]
    ),
  }),
});

export const RentalRequestValidation = {
  createRentalRequestValidationSchema,
  updateRentalRequestValidationSchema,
};