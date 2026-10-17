
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3client from "../config/s3Connection.js";

export async function createSignedUrl(command){
    const url=await getSignedUrl(S3client,command);
    return url;
}
