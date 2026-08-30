import express from "express";
import { createProductUpload } from "./UploadProduct.controller.js";

const UploadRouter=express.Router();

UploadRouter.post('/get-upload-url',createProductUpload);

export default UploadRouter;