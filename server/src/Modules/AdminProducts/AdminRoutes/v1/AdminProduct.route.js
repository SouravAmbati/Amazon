import express from "express";
import upload from "../../../../middleware/multer.js";
import { productRateLimiter } from "../../../../middleware/rateLimiter.js";
import { createProduct, getAllProducts, updateProduct } from "../../AdminProduct.controller.js";
import { productConcurrencyLimiter } from "../../../../middleware/concurrencyLimiter.js";


const UploadRouter=express.Router();
UploadRouter.post('/product',productRateLimiter,productConcurrencyLimiter,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),createProduct);
UploadRouter.get('/product',getAllProducts);
UploadRouter.patch('/product',productRateLimiter,productConcurrencyLimiter,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),updateProduct);

export default UploadRouter;