import express from "express";
import { getProductByCategoryController, getProductByIdController, getProductController, getProductsByFilterController } from "../../ProductController.js";

const ProductRouter=express.Router();
ProductRouter.get('/products',getProductController);
ProductRouter.get('/product',getProductByIdController);
ProductRouter.get('/category',getProductByCategoryController);
ProductRouter.get('/filter',getProductsByFilterController);

export default ProductRouter;