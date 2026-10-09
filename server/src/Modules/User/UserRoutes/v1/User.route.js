
import express from "express";

import { loginController, logoutController, meController, signupController } from "../../userController.js";
import { authorize } from "../../../../middleware/authorize.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signupController);
UserRouter.post("/login", loginController);
UserRouter.get("/me", authorize, meController);
UserRouter.post("/logout", authorize, logoutController);

export default UserRouter;
