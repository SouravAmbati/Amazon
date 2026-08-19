import express from "express";
import dotenv from 'dotenv';
import ProductRouter from "./src/Modules/Products/product.route.js";
dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(express.json());

app.use('/api/products',ProductRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})