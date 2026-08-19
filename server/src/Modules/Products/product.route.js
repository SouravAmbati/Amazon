import express from "express";
import { createProduct } from "./product.controller.js";

const ProductRouter=express.Router();

ProductRouter.post("/create",createProduct);



export default ProductRouter;