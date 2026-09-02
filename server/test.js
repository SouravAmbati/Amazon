
// import { ListObjectsV2Command } from "@aws-sdk/client-s3";
// import b2 from "./src/storage/S3CONNECTION.js";
// import mq from "./Queue/MqConnection.js";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import {S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
const b2 = new S3Client({
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
});
const params = {
  Bucket: "shopzone-media",
  Key:"product/1900c920-a573-11f1-b271-7ff400574dd6/classic-tshirt.jpeg"
};
// async function makeRequest(url, options = {}) {
//     const response = await fetch(url, {
//         ...options,
//         headers: {
//             "x-apikey": "adb9610d4b626f61fdac796c696adbdf0221ac7ed21e742dc595b7bf3b5bd13b",
//             ...options.headers
//         }
//     });

//     // Handle failed requests gracefully
//     if (!response.ok) {
//         const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
//         throw new Error(error.error?.message || 'Request failed!');
//     }

//     return response.json(); // Parse response JSON
// }
// async function scanVirus(filePath) {
//   const submitResult=await makeRequest("https://www.virustotal.com/api/v3/files",{
//     method:"POST",
//     headers:{
//         "accept": "application/json",
//         "content-type": "multipart/form-data",
//         duplex: "half",
//     },
//     body: filePath
//   })
//   console.log(submitResult);
// }
const fetchKeyInfo = async () => {
  try {
    const command=new GetObjectCommand(params);
    const data=await b2.send(command);
    const fileBlob = await new Response(data.Body).blob();
    const formData = new FormData();
    formData.append("file", fileBlob, "product/1900c920-a573-11f1-b271-7ff400574dd6/classic-tshirt.jpeg");
   const vtResponse = await fetch("https://virustotal.com", {
      method: "POST",
      headers: {
        "x-apikey": "adb9610d4b626f61fdac796c696adbdf0221ac7ed21e742dc595b7bf3b5bd13b",
      },
      body: formData,
    });
     const result =vtResponse;
       console.log("VirusTotal Analysis ID:", result.data);
  } catch (error) {
     console.log(error);
  }
};

await fetchKeyInfo();