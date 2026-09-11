import express from "express";
import upload from "../../../../middleware/multer.js";

import { productRateLimiter } from "../../../../middleware/rateLimiter.js";
import { createProduct } from "../../AdminProduct.controller.js";


const UploadRouter=express.Router();
UploadRouter.post('/create',productRateLimiter,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),createProduct);

export default UploadRouter;