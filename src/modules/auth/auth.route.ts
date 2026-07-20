import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";


const router = Router();

router.post("/register",
      validateRequest(AuthValidation.registerValidationSchema),
    authController.registerUser);

router.post("/login",
    validateRequest(AuthValidation.loginValidationSchema),
    authController.loginUser);

router.get("/me",
    auth(Role.TENANT,Role.LANDLORD),
    authController.getUser);


export const authRoutes = router;