import { Router } from "express";

import { register } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";

const Authrouter = Router();

Authrouter.post(
    "/register",
    validate(registerSchema),
    register
);

export default Authrouter;