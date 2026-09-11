import { fileTypeFromFile } from "file-type";
import sharp from "sharp";

export const checkFileType = async (images) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  for (const image of images) {
    if (image.size > MAX_FILE_SIZE) {
      throw new Error(
        `${image.originalname} is too large. Maximum size is 5 MB`,
      );
    }
    // Reads the actual bytes of the file
    const type = await fileTypeFromFile(image.path);

    if (!type) {
      throw new Error("Unable to determine image file type");
    }

    const allowedTypes = ["image/jpeg"];

    if (!allowedTypes.includes(type.mime)) {
      throw new Error(`Invalid image type: ${type.mime}`);
    }
    // 3. Check whether the file is actually a valid image
    try {
      const metadata = await sharp(image.path).metadata();

      // 4. Make sure dimensions exist
      if (!metadata.width || !metadata.height) {
        throw new Error("Invalid image");
      }

      // 5. Check maximum dimensions
      if (metadata.width > 5000 || metadata.height > 5000) {
        throw new Error("Image dimensions are too large");
      }
    } catch (error) {
      // If our own validation error occurred, preserve it
      if (error.message === "Image dimensions are too large") {
        throw error;
      }

      throw new Error("Invalid or corrupted image");
    }
  }

  return true;
};
