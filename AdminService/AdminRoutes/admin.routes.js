import express from "express";
import { UploadUrls } from "../src/AdminController.js";


const AdminRoutes = express.Router();
AdminRoutes.post('/image-upload',UploadUrls)



export default AdminRoutes;
