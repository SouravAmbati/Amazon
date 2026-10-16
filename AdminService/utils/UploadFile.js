import {fileTypeFromBuffer} from "file-type";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import { createSignedUrl } from "./createSignedUrl.js";
export async function uploadFile(images){
    const urls = [];
    const array_of_allowed_files=['png','jpeg','jpg'];
    const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg'];
    const allowed_file_size=10;
    for (const image of images){
        const file_extention=image.originalname.slice(
            ((image.originalname.lastIndexOf('.')-1)>>>0)+2
        )
        if(!array_of_allowed_files.includes(file_extention)){
            throw Error('Invalid file')
        }
        if(!array_of_allowed_file_types.includes(image.mimetype)){
            throw Error('Invalid file')
        }
        if((image.size/(1024*1024))>allowed_file_size){
            throw Error('File too large')
        }
        const command=new PutObjectCommand({
            Bucket:process.env.B2_BUCKET_NAME,
            Key:`uploads/product_images/${image.name}`,
            ContentType:image.mimetype
        })
        const url=await createSignedUrl(command);
        urls.push({
            name:image.name,
            url:url,
            key:`uploads/product_images/${image.name}`
        })
    }
    return urls;
}