import { Router } from "express";

import { login, register, verifyEmail } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { loginSchema, registerSchema, verifyEmailSchema } from "./auth.validation.js";

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
Authrouter.post(
    "/login",
    validate(loginSchema),
    login
);

export default Authrouter;