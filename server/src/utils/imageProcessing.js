import { fileTypeFromFile } from "file-type";
import sharp from "sharp";

export const checkFileType = async (images) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const allowedTypes = ["image/jpeg", "image/png"];
  const allowedExtensions = /\.(jpg|jpeg|png)$/i;

  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("At least one image is required");
  }

  if (images.length > 4) {
    throw new Error("Maximum 4 images are allowed");
  }

  for (const image of images) {
    if (
      !image.name ||
      !image.originalname ||
      !image.mimetype ||
      !Number.isFinite(image.size)
    ) {
      throw new Error("Invalid image metadata");
    }

    if (!allowedTypes.includes(image.mimetype)) {
      throw new Error(
        `${image.originalname} has an invalid image type. Only JPG, JPEG, and PNG are allowed`,
      );
    }

    if (image.size <= 0 || image.size > MAX_FILE_SIZE) {
      throw new Error(
        `${image.originalname} is too large or empty. Maximum size is 5 MB`,
      );
    }

    if (
      !allowedExtensions.test(image.name) ||
      !allowedExtensions.test(image.originalname)
    ) {
      throw new Error(
        `${image.originalname} must have a JPG, JPEG, or PNG extension`,
      );
    }
  }

  return true;
};
