import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Get All Users
router.get(
  "/users",
  auth(Role.ADMIN),
  adminController.getAllUsers
);

// Update User Status (Ban / Unban)
router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  adminController.updateUserStatus
);

// Get All Properties
router.get(
  "/properties",
  auth(Role.ADMIN),
  adminController.getAllProperties
);

// Get All Rental Requests
router.get(
  "/rentals",
  auth(Role.ADMIN),
  adminController.getAllRentalRequests
);

export const adminRoutes = router;