import express from "express";
import dotenv from 'dotenv';
import connectCloudinary from "./src/config/cloudinarySetup.js";
import UploadRouter from "./src/Modules/AdminProducts/AdminRoutes/v1/AdminProduct.route.js";
import cors from "cors"
import UploadRouterv2 from "./src/Modules/AdminProducts/AdminRoutes/v2/AdminProduct.route.js";

dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

connectCloudinary();

app.use('/api/product/v1',UploadRouter);
app.use('/api/product/v2',UploadRouterv2);

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})