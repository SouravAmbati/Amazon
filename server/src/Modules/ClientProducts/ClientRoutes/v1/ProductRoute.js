import express from "express";
import { getProductByCategoryController, getProductByIdController, getProductController, getProductsByFilterController, searchProductsController } from "../../ProductController.js";

const ProductRouter=express.Router();
ProductRouter.get('/products',getProductController);
ProductRouter.get('/product',getProductByIdController);
ProductRouter.get('/category',getProductByCategoryController);
ProductRouter.get('/filter',getProductsByFilterController);
ProductRouter.get(
    "/search",
    searchProductsController
);

export default ProductRouter;