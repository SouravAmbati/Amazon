import { uploadFile } from "../utils/UploadFile.js";
import { cursorSchema } from "../validators/cursorValidator.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";
import { createProductService, getAllTheProducts, updateProductService } from "./AdminService.js";

export const UploadUrls=async(req,res)=>{
    try {
        const{images}=req.body;
        if(!images){
            return res.json({success:false,message:"Images Required"});
        }
        const urls=await uploadFile(images);
        if(!urls){
            return res.status(400).json({success:false,message:urls});
        }
        res.status(201).json({success:true,urls:urls});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const createProduct = async (req, res) => {
  try {
    const body = {
      ...req.body,
      colors: req.body.colors,
      sizes: req.body.sizes,
    };
    const { data, error } = createProductSchema.safeParse(body);
    const idempotencyKey = req.get("IdempotencyKey");
    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header is required",
      });
    }
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.issues[0].message });
    }
    const imageKeys = body.urls.map((image) => image.key);
    const response = await createProductService(
      idempotencyKey,
      data.product_name,
      data.colors,
      imageKeys,
      data.sizes,
      data.about_product,
      data.price,
      data.category,
    );
    res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllProducts=async(req,res)=>{
  const { cursor } = req.query;
   const body = {
      cursor
    };
  const { data, error } = cursorSchema.safeParse(body);
  if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.issues[0].message });
    }
  const response=await getAllTheProducts(data.cursor);
   res.status(200).json(response);
}
export const updateProduct=async(req,res)=>{
 try {
    //get the product id,image_id,color_id from the headers;
    const product_id = req.get("product_id");
    const image_id = req.get("image_id");
    const color_id = req.get("color_id");
    const idempotencyKey = req.get("IdempotencyKey");
    //get all the data and validate it through the validator;
     const body = {
      ...req.body,
      colors: req.body.colors,
      sizes: req.body.sizes,
    };
    const { data, error } = updateProductSchema.safeParse(body);
    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header is required",
      });
    }
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.issues[0].message });
    }
    const imageKeys = body.urls.map((image) => image.key);
    //send all the data to the service
    const response=await updateProductService(
      product_id,
      image_id,
      color_id,
      data.product_name,
      imageKeys,
      data.colors,
      data.category,
      data.sizes,
      data.about_product,
      data.price,
      idempotencyKey
    );
    //send the response
    res.status(200).json(response);
 } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
 }
}