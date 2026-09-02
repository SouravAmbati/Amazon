import express from "express";
import { createProduct, PublishKeyToQueueController} from "./UploadProduct.controller.js";

const UploadRouter=express.Router();

UploadRouter.post('/get-upload-url',createProduct);
UploadRouter.post('/publish-url',PublishKeyToQueueController);

export default UploadRouter;