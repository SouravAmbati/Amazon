import { Router } from "express";
import { createBrandSchema } from "./brand.validation.js";
import * as controller from "./brand.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";



const brandRouter = Router();

brandRouter.post(
    "/",
    validate(createBrandSchema),
    controller.createBrand
);


export default brandRouter;