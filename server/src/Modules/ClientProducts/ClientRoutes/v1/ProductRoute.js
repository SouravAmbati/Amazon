import express from "express";
import { getProductController } from "../../ProductController.js";

const ProductRouter=express.Router();
ProductRouter.get('/products',getProductController);

export default ProductRouter;