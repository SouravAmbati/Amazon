import express from "express";
import upload from "../../../../middleware/multer.js";
import { productRateLimiter } from "../../../../middleware/rateLimiter.js";
import { createProducts} from "../../AdminProduct.controller.js";
import { productConcurrencyLimiter } from "../../../../middleware/concurrencyLimiter.js";


const UploadRouterv2=express.Router();
UploadRouterv2.post('/product',productRateLimiter,productConcurrencyLimiter,createProducts);

export default UploadRouterv2;