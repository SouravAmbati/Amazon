import express from "express";
import upload from "../../../../middleware/multer.js";
import { productRateLimiter } from "../../../../middleware/rateLimiter.js";
import { createProduct, getAllProducts, updateProduct, UploadImageURL } from "../../AdminProduct.controller.js";
import { productConcurrencyLimiter } from "../../../../middleware/concurrencyLimiter.js";


const UploadRouter=express.Router();
UploadRouter.post('/image-validate',productRateLimiter,UploadImageURL);
UploadRouter.post('/product',productRateLimiter,createProduct);
UploadRouter.get('/product',getAllProducts);
UploadRouter.patch('/product',productRateLimiter,updateProduct);

export default UploadRouter;