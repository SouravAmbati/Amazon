import express from "express";
import { getProductByCategoryController, getProductByIdController, getProductController } from "../../ProductController.js";

const ProductRouter=express.Router();
ProductRouter.get('/products',getProductController);
ProductRouter.get('/product',getProductByIdController);
ProductRouter.get('/category',getProductByCategoryController);

export default ProductRouter;