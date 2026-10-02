import s3Client from "../config/BlackBaze.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function createSignedUrl(command){
    const url=await getSignedUrl(s3Client,command);
    return url;
}