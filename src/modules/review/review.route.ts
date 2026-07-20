import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview
);


router.get(
  "/property/:propertyId",
  reviewController.getPropertyReviews
);


router.patch(
  "/:id",
  auth(Role.TENANT),
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  reviewController.updateReview
);


router.delete(
  "/:id",
  auth(Role.TENANT),
  reviewController.deleteReview
);

export const reviewRoutes = router;