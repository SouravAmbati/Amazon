import { v2 as cloudinary } from "cloudinary";
import {
  createProductService,
  getAllTheProducts,
  updateProductService,
} from "./AdminProduct.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./AdminValidators/productValidator.js";
import { checkFileType } from "../../utils/imageProcessing.js";
import { cursorSchema } from "./AdminValidators/cursorValidator.js";

export const UploadImageURL = async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    // Check credentials using the actual .env variable names.
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Missing Cloudinary configuration:", {
        cloudName: Boolean(cloudName),
        apiKey: Boolean(apiKey),
        apiSecret: Boolean(apiSecret),
      });

      return res.status(500).json({
        success: false,
        message: "Cloudinary credentials are missing",
      });
    }

    await checkFileType(images);

    const folder = "shopzone/products";

    const uploadDetails = images.map(() => {
      const timestamp = Math.floor(Date.now() / 1000);

      // Sign the exact parameters sent by the frontend.
      const signature = cloudinary.utils.api_sign_request(
        { folder, timestamp },
        apiSecret
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        apiKey,
        timestamp,
        signature,
        folder,
      };
    });

    return res.status(200).json({
      success: true,
      uploadDetails,
    });
  } catch (error) {
    console.error("Cloudinary signing error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { data, error } = createProductSchema.safeParse(req.body);

    const idempotencyKey = req.get("IdempotencyKey");

    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header is required",
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });
    }

    const imagesURL = [];

    for (const image of req.body.images || []) {
      if (typeof image === "string") {
        imagesURL.push(image);
      }
    }

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

    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  const { cursor } = req.query;
  const body = {
    cursor,
  };
  const { data, error } = cursorSchema.safeParse(body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.issues[0].message });
  }
  const response = await getAllTheProducts(data.cursor);
  res.status(200).json(response);
};
export const updateProduct = async (req, res) => {
  const uploadedImages = [];
  try {
    //get the product id,image_id,color_id from the headers;
    const product_id = req.get("product_id");
    const image_id = req.get("image_id");
    const color_id = req.get("color_id");
    const idempotencyKey = req.get("IdempotencyKey");
    //get all the data and validate it through the validator;
    const body = {
      ...req.body,
      colors: JSON.parse(req.body.colors),
      sizes: JSON.parse(req.body.sizes),
    };
    console.log(body, image_id);
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
    const response = await updateProductService(
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
      idempotencyKey,
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
};
