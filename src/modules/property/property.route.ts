import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { propertyController } from "./property.controller";
import { PropertyValidation } from "./property.validation";

const propertyRouter = Router();
const landlordRouter = Router();


propertyRouter.get(
    "/",
    propertyController.getAllProperties
);

propertyRouter.get(
    "/:id",
    propertyController.getSingleProperty
);



landlordRouter.post(
    "/properties",
    auth(Role.LANDLORD),
    validateRequest(PropertyValidation.createPropertyValidationSchema),
    propertyController.createProperty
);

landlordRouter.put(
    "/properties/:id",
    auth(Role.LANDLORD),
    validateRequest(PropertyValidation.updatePropertyValidationSchema),
    propertyController.updateProperty
);

landlordRouter.delete(
    "/properties/:id",
    auth(Role.LANDLORD),
    propertyController.deleteProperty
);



export const propertyRoutes = propertyRouter;
export const landlordRoutes = landlordRouter;