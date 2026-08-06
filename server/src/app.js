import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import Authrouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import addressRouter from "./modules/address/address.route.js";
import adminCategoryRouter from "./modules/category/admin.routes.js";
import brandRouter from "./modules/Brand/admin.routes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(errorHandler);

app.use("/api/auth",Authrouter)
app.use(
    "/api/addresses",
    addressRouter
);
app.use(
    "/api/admin/brands",
    brandRouter
);
// app.use("/api/categories", customerCategoryRoutes);

app.use("/api/admin/categories", adminCategoryRouter);

export default app;