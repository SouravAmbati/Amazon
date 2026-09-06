import express from "express";
import { createProduct} from "./UploadProduct.controller.js";
import upload from "../../middleware/multer.js";

const UploadRouter=express.Router();

UploadRouter.post('/create',upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),createProduct);

export default UploadRouter;