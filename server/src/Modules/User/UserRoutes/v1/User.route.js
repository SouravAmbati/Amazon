
import express from "express";

import {
    loginController,
    logoutController,
    meController,
    refreshController,
    signupController,
} from "../../userController.js";

import { authorize } from "../../../../middleware/authorize.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signupController);
UserRouter.post("/login", loginController);

UserRouter.post("/refresh", refreshController);

UserRouter.get("/me", authorize, meController);


UserRouter.post("/logout", logoutController);

export default UserRouter;
