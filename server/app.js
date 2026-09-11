import express from "express";
import dotenv from 'dotenv';
import connectCloudinary from "./src/config/cloudinarySetup.js";
import UploadRouter from "./src/Modules/AdminProducts/AdminRoutes/v1/AdminProduct.route.js";

dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(express.json());

connectCloudinary();

app.use('/api/product/v1',UploadRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})