import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand} from "@aws-sdk/client-s3";
import "dotenv/config";
import b2 from "./S3CONNECTION.js";


export async function getObjectURL(key,contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(b2, command);
    return url;
  } catch (error) {
    console.log(error);
  }
}
// async function init() {
//   console.log("graphql.jpeg: ", await getObjectURL("graphql.jpeg"));
// }
// init();
