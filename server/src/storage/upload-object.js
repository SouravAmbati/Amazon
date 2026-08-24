import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import b2 from "./b2.js";

export async function uploadObject({
  key,
  body,
  contentType,
}) {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await b2.send(command);
}