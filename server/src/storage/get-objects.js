import { GetObjectCommand } from "@aws-sdk/client-s3";
import b2 from "./b2.js";

const BUCKET_NAME = process.env.B2_BUCKET_NAME;

export async function getObject(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const result = await b2.send(command);

  return result;
}