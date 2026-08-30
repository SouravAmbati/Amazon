import express from "express";
import { createProduct} from "./UploadProduct.controller.js";

const UploadRouter=express.Router();

UploadRouter.post('/get-upload-url',createProduct);

export default UploadRouter;