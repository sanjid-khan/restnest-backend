import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { rentalRequestController } from "./rentalRequest.controller";
import { RentalRequestValidation } from "./rentalRequest.validation";

const rentalRequestRouter = Router();
const landlordRentalRequestRouter = Router();


rentalRequestRouter.post(
  "/",
  auth(Role.TENANT),
  validateRequest(
    RentalRequestValidation.createRentalRequestValidationSchema
  ),
  rentalRequestController.createRentalRequest
);



rentalRequestRouter.get(
  "/",
  auth(Role.TENANT),
  rentalRequestController.getMyRentalRequests
);



rentalRequestRouter.get(
  "/:id",
  auth(Role.TENANT),
  rentalRequestController.getSingleRentalRequest
);


landlordRentalRequestRouter.get(
  "/",
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRentalRequests
);


landlordRentalRequestRouter.patch(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(
    RentalRequestValidation.updateRentalRequestValidationSchema
  ),
  rentalRequestController.updateRentalRequestStatus
);


export const rentalRequestRoutes = rentalRequestRouter;
export const landlordRentalRequestRoutes = landlordRentalRequestRouter;