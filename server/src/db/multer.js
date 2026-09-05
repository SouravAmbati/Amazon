import multer from "multer";
import Storage from "./cloudinarySetup.js";

const upload = multer({ Storage });

export default upload
