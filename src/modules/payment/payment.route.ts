import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

//  checkout session
router.post(
  "/create",
  auth(Role.TENANT),
  paymentController.createPaymentSession
);


// stripe webhook
router.post(
  "/confirm",
  paymentController.handleWebhook
);


router.get(
  "/",
  auth(Role.TENANT),
  paymentController.getPaymentHistory
);


router.get(
  "/:id",
  auth(Role.TENANT),
  paymentController.getSinglePayment
);

export const paymentRoutes = router;