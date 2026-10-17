import { uploadFile } from "../utils/UploadFile.js";
import { createProductSchema } from "../validators/product.validator.js";
import { createProductService } from "./AdminService.js";

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