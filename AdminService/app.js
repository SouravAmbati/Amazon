import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import AdminRoutes from "./AdminRoutes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/",AdminRoutes);

export default app;