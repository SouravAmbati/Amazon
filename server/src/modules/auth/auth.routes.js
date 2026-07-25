import { Router } from "express";

import { login, logout, me, register, verifyEmail } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { loginSchema, registerSchema, verifyEmailSchema } from "./auth.validation.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

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
Authrouter.get(
    "/me",
    requireAuth,
    me
);
Authrouter.post(
    "/logout",
    requireAuth,
    logout
);

export default Authrouter;