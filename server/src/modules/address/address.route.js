import { Router } from "express";
import { createAddressSchema, updateAddressSchema } from "./address.validation.js";
import * as controller from "./address.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";


const addressRouter = Router();

addressRouter.post(
    "/",
    requireAuth,
    validate(createAddressSchema),
    controller.createAddress
);
addressRouter.get(
    "/",
    requireAuth,
    controller.getAddresses
);
addressRouter.get(
    "/:id",
    requireAuth,
    controller.getAddress
);
addressRouter.patch(
    "/:id",
    requireAuth,
    validate(updateAddressSchema),
    controller.updateAddress
);
export default addressRouter;