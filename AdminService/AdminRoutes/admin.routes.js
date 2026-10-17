import express from "express";
import { createProduct, UploadUrls } from "../src/AdminController.js";


const AdminRoutes = express.Router();
AdminRoutes.post('/image-upload',UploadUrls);
AdminRoutes.post('/products-upload',createProduct);


export default AdminRoutes;
