import { Router } from "express";
import { createBrandSchema, updateBrandSchema } from "./brand.validation.js";
import * as controller from "./brand.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";



const brandRouter = Router();

brandRouter.post(
    "/",
    validate(createBrandSchema),
    controller.createBrand
);
brandRouter.get(
    "/",
    controller.getBrands
);
brandRouter.get(
    "/:slug",
    controller.getBrandBySlug
);
brandRouter.patch(
    "/:id",
    validate(updateBrandSchema),
    controller.updateBrand
);
brandRouter.delete(
    "/:id",
    controller.deleteBrand
);
export default brandRouter;