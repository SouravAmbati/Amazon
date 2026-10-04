import express from "express";
import dotenv from "dotenv";
import connectCloudinary from "./src/config/cloudinarySetup.js";
import UploadRouter from "./src/Modules/AdminProducts/AdminRoutes/v1/AdminProduct.route.js";
import cors from "cors";
import AuthRouter from "./src/Modules/AdminProducts/AdminAuthentication/AdminAuthRoutes/v1/AdminAuthRoute.js";
import ProductRouter from "./src/Modules/ClientProducts/ClientRoutes/v1/ProductRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

connectCloudinary();

app.use("/api/product/v1", UploadRouter);
app.use("/api/auth/v1", AuthRouter);
app.use("/api/products/v1", ProductRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
