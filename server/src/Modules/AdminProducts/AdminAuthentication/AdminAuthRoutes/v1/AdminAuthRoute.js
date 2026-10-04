import express from "express";
import { AdminLoginController } from "../../AdminAuthController.js";

const AuthRouter = express.Router();
AuthRouter.post("/login", AdminLoginController);

export default AuthRouter;
