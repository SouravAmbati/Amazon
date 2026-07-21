import { Router } from "express";

import { register, verifyEmail } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { registerSchema, verifyEmailSchema } from "./auth.validation.js";

const Authrouter = Router();

Authrouter.post(
    "/register",
    validate(registerSchema),
    register
);
Authrouter.post(
    "/verify-email",
    validate(verifyEmailSchema),
    verifyEmail
);

export default Authrouter;