import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    rentalRequestId: z.string("Rental Request Id is required"), 
    rating: z
      .number("Rating is required")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: z.string().optional(),
  }),
});


const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});


export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};