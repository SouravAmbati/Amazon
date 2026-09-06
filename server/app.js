import express from "express";
import dotenv from 'dotenv';
import UploadRouter from "./src/Modules/Products/UploadProduct.route.js";
import connectCloudinary from "./src/config/cloudinarySetup.js";

dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(express.json());

connectCloudinary();

app.use('/api/product',UploadRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})