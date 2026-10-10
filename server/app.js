import express from "express";
import dotenv from "dotenv";
import connectCloudinary from "./src/config/cloudinarySetup.js";
import UploadRouter from "./src/Modules/AdminProducts/AdminRoutes/v1/AdminProduct.route.js";
import cors from "cors";
import AuthRouter from "./src/Modules/AdminProducts/AdminAuthentication/AdminAuthRoutes/v1/AdminAuthRoute.js";
import ProductRouter from "./src/Modules/ClientProducts/ClientRoutes/v1/ProductRoute.js";
import CartRouter from "./src/Modules/carts/cartRoutes/v1/cartRoute.js";
import OrderRouter from "./src/Modules/orders/orderRoutes/v1/orderRoutes.js";
import UserRouter from "./src/Modules/User/UserRoutes/v1/User.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "https://amazon-client-peach.vercel.app",
    "https://amazon-mauve-theta.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://192.168.1.7:5173",
  ],
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));


connectCloudinary();

app.get("/",(req,res)=>{
  res.json("Server Running Successfully");
})

app.use("/api/product/v1", UploadRouter);
app.use("/api/auth/v1", AuthRouter);
app.use("/api/products/v1", ProductRouter);
app.use("/api/carts/v1", CartRouter);
app.use("/api/orders/v1", OrderRouter);
app.use("/api/user/v1", UserRouter);
export default app;
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });
