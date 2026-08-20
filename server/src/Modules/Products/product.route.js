import express from "express";
import { createProduct, createProductImageUpload } from "./product.controller.js";

const ProductRouter=express.Router();

ProductRouter.post("/create",createProduct);
ProductRouter.post("/create/:productId/images",createProductImageUpload);



export default ProductRouter;