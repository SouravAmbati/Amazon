import express from "express";
import { getProductByIdController, getProductController } from "../../ProductController.js";

const ProductRouter=express.Router();
ProductRouter.get('/products',getProductController);
ProductRouter.get('/product',getProductByIdController);

export default ProductRouter;