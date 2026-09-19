import { v2 as cloudinary } from "cloudinary";
import { createProductService, getAllTheProducts, updateProductService } from "./AdminProduct.service.js";
import { createProductSchema, updateProductSchema } from "./AdminValidators/productValidator.js";
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
export const updateProduct=async(req,res)=>{
  const uploadedImages = [];
 try {
    //get the product id,image_id,color_id from the headers;
    const product_id = req.get("product_id");
    const image_id = req.get("image_id");
    const color_id = req.get("color_id");
    const idempotencyKey = req.get("Idempotency-Key");
    //get all the data and validate it through the validator;
     const body = {
      ...req.body,
      colors: JSON.parse(req.body.colors),
      sizes: JSON.parse(req.body.sizes),
    };
    console.log(body);
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
    //get the images
    //upload it to the cloudinary
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
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
    //send all the data to the service
    const response=await updateProductService(
      product_id,
      image_id,
      color_id,
      data.product_name,
      imagesURL,
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
}