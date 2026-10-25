
import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectCloudinary from "./src/config/cloudinarySetup.js";
import { initializeSocket } from "./src/config/socket.js";

import UploadRouter from "./src/Modules/AdminProducts/AdminRoutes/v1/AdminProduct.route.js";
import AuthRouter from "./src/Modules/AdminProducts/AdminAuthentication/AdminAuthRoutes/v1/AdminAuthRoute.js";
import ProductRouter from "./src/Modules/ClientProducts/ClientRoutes/v1/ProductRoute.js";
import CartRouter from "./src/Modules/carts/cartRoutes/v1/cartRoute.js";
import OrderRouter from "./src/Modules/orders/orderRoutes/v1/orderRoutes.js";
import UserRouter from "./src/Modules/User/UserRoutes/v1/User.route.js";

import Workerrouter from "./workers/workerRoutes/workerRoutes.js";

import { stripeWebhookController } from "./src/Modules/orders/orderWebhookController.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());
app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookController
);

app.use(express.json());

initializeSocket(server);

connectCloudinary();

app.use("/api/product/v1", UploadRouter);
app.use("/api/auth/v1", AuthRouter);
app.use("/api/products/v1", ProductRouter);
app.use("/api/carts/v1", CartRouter);
app.use("/api/orders/v1", OrderRouter);
app.use("/api/user/v1", UserRouter);
app.use("/api/workers", Workerrouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
