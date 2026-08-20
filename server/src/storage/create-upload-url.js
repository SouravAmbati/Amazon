import b2 from "./b2.js";
import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

export async function createUploadUrl({
  key,
  contentType,
}) {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(
    b2,
    command,
    {
      expiresIn: 60 * 5,
    }
  );

  return uploadUrl;
}