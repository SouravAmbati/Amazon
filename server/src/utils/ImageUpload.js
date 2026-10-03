import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createSignedUrl } from "./createSignedUrlForUpload.js";

export const imageUploadURL = async (images) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const urls = [];

  for (const image of images) {

    if (image.size > MAX_FILE_SIZE) {
      throw new Error(
        `${image.name} is too large. Maximum size is 5 MB`
      );
    }

    if (!allowedTypes.includes(image.type)) {
      throw new Error(
        `${image.name} has an invalid image format. Only JPG, JPEG and PNG are allowed`
      );
    }

    const command = await putObjectUrl(
      image.name,
      image.format
    );

    const url = await createSignedUrl(command);

    urls.push({
      name: image.name,
      url: url,
    });
  }

  return urls;
};
async function putObjectUrl(filename,contentType){
  const command=new PutObjectCommand({
    Bucket:process.env.B2_BUCKET_NAME,
    Key:`uploads/product_images/${filename}`,
     ContentType: contentType,
  })
  return command;
}