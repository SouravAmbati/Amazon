import { GetObjectCommand} from "@aws-sdk/client-s3";
import b2 from "../src/storage/S3CONNECTION.js";
import mq from "../Queue/MqConnection.js";
import fileTypeChecker from "file-type-checker";
import pool from "../src/db/connection.js";

const fetchKeyInfoController = async (key) => {
  const client=await pool.connect();
  console.log((key.key));
      const params = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key:key.key
    };
    try {
    const command=new GetObjectCommand(params);
    const data=await b2.send(command)
    const Buffer=await data.Body.transformToByteArray(16)
    const response=await scanUpload(Buffer);
    if(!response){
      console.log("file is not accepteable");
    }else{
      await client.query("UPDATE images SET image_status=$1 WHERE storage_key=$2",["READY",key.key]);
      console.log("file verification completed");
    }
  } catch (error) {
     console.log(error);
  }
};

async function scanUpload(file) {
  const response=fileTypeChecker.validateFileType(file, ["png", "gif", "jpeg"]);
  return response;
}

const scanVirus=async()=>{
     const channel=await mq.createChannel();
     await channel.assertQueue("product_image_queue",{durable:true});
     console.log("waiting for the message...");
     channel.consume("product_image_queue",async (message)=>{
        if(message!==null){
            const client=await pool.connect();
            await client.query("UPDATE images SET image_status=$1 WHERE storage_key=$2",["PROCESSING",JSON.parse(message.content)]);
            await fetchKeyInfoController(JSON.parse(message.content));
            channel.ack(message);
        }
     })
}

await scanVirus();

