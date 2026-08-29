import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const b2 = new S3Client({
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
});

export default b2;

// this function is just for testing if the server is connected to backblaze server or not
// const listBuckets = async () => {
//   try {
//     const response = await b2.send(new ListBucketsCommand({}));
//     console.log('Buckets in account:');
//     response.Buckets.forEach(bucket => {
//       console.log(bucket.Name);
//     });
//   } catch (err) {
//     console.error("Error listing buckets:", err);
//     throw err;
//   }
// };

// await listBuckets();