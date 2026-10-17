import express from "express";
import { createProduct, getAllProducts, updateProduct, UploadUrls } from "../src/AdminController.js";


const AdminRoutes = express.Router();
AdminRoutes.post('/image-upload',UploadUrls);
AdminRoutes.post('/products-upload',createProduct);
AdminRoutes.get('/products',getAllProducts);
AdminRoutes.put('/products',updateProduct);


export default AdminRoutes;
