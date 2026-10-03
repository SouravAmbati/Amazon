import "dotenv/config";

const auth = Buffer.from(
  `${process.env.B2_KEY_ID}:${process.env.B2_APPLICATION_KEY}`
).toString("base64");

// 1. Authorize with Backblaze
const authResponse = await fetch(
  "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
  {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  }
);

const authData = await authResponse.json();

console.log("Authorization:", authResponse.status);

if (!authResponse.ok) {
  console.error(authData);
  process.exit(1);
}

// 2. Set Native CORS rules
const corsRules = [
  {
    corsRuleName: "shopzone-local",

    allowedOrigins: [
      "http://localhost:5173"
    ],

    allowedHeaders: [
      "*"
    ],

    allowedOperations: [
      "s3_put"
    ],

    exposeHeaders: [
      "ETag"
    ],

    maxAgeSeconds: 3600
  }
];

const response = await fetch(
  `${authData.apiInfo.storageApi.apiUrl}/b2api/v3/b2_update_bucket`,
  {
    method: "POST",

    headers: {
      Authorization: authData.authorizationToken,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      accountId: authData.accountId,
      bucketId: process.env.B2_BUCKET_ID,
      corsRules,
    }),
  }
);

const result = await response.json();

console.log("CORS update status:", response.status);
console.log(result);