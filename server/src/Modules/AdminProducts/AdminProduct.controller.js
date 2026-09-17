import { v2 as cloudinary } from "cloudinary";
import { createProductService, getAllTheProducts } from "./AdminProduct.service.js";
import { createProductSchema } from "./AdminValidators/productValidator.js";
import { checkFileType } from "../../utils/imageProcessing.js";
import { cursorSchema } from "./AdminValidators/cursorValidator.js";

export const createProduct = async (req, res) => {
  const uploadedImages = [];
  try {
    const body = {
      ...req.body,
      colors: JSON.parse(req.body.colors),
      sizes: JSON.parse(req.body.sizes),
    };
    const { data, error } = createProductSchema.safeParse(body);
    const idempotencyKey = req.get("Idempotency-Key");
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
    const image1 = req.files.image1[0];
    const image2 = req.files.image2[0];
    const image3 = req.files.image3[0];
    const image4 = req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined,
    );
    await checkFileType(images);
    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        uploadedImages.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
        return result.secure_url;
      }),
    );
    const response = await createProductService(
      idempotencyKey,
      data.product_name,
      data.colors,
      imagesURL,
      data.sizes,
      data.about_product,
      data.price,
      data.category,
    );
    res.status(201).json(response);
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map((image) =>
        cloudinary.uploader.destroy(image.public_id),
      ),
    );
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