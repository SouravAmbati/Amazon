import { Router } from "express";
import { createCategorySchema } from "./category.validation.js";
import * as controller from "./category.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";

const adminCategoryRouter = Router();

adminCategoryRouter.post(
    "/",
    validate(createCategorySchema),
    controller.createCategory
);
adminCategoryRouter.get(
    "/tree",
    controller.getCategoryTree
);
adminCategoryRouter.get(
    "/:slug",
    controller.getCategoryBySlug
);
export default adminCategoryRouter;