import { Router } from "express"
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";


const router = Router();


router.get("/me",
    auth(Role.LANDLORD,Role.TENANT),
    userController.getMyProfile);

router.put("/my-profile",
    auth(Role.LANDLORD,Role.TENANT),
    validateRequest(UserValidation.updateProfileValidationSchema),
    userController.updateMyProfile);


export const userRoutes = router