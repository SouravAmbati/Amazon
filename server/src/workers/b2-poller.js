import "dotenv/config";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

import b2 from "../storage/b2.js";
import pool from "../db/pool.js";
import { publishEvent } from "../Queue/publish.js";

const BUCKET_NAME = process.env.B2_BUCKET_NAME;

export async function listB2Objects() {
  console.log("Polling Backblaze B2...");

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
  });

  const result = await b2.send(command);

  const objects = result.Contents ?? [];

  console.log(`Found ${objects.length} objects`);

  for (const object of objects) {
    const objectKey = object.Key;

    console.log(`Checking B2 object: ${objectKey}`);

    const imageResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        storage_key,
        status
      FROM product_images
      WHERE storage_key = $1
      `,
      [objectKey]
    );

    if (imageResult.rowCount === 0) {
      console.log(
        `No product_images record found for ${objectKey}`
      );

      continue;
    }

    const image = imageResult.rows[0];

    console.log("Database image:", {
      id: image.id,
      productId: image.product_id,
      status: image.status,
      storageKey: image.storage_key,
    });

    /*
     * Only publish images that have not started processing yet.
     */
    if (image.status !== "PENDING") {
      console.log(
        `Skipping ${objectKey} because status is ${image.status}`
      );

      continue;
    }

    console.log(
      `Image ${image.id} is PENDING. Publishing event...`
    );

    await publishEvent({
      routingKey: "image.uploaded",

      message: {
        eventType: "IMAGE_UPLOADED",
        productId: image.product_id,
        imageId: image.id,
        storageKey: objectKey,
      },
    });

    console.log(
      `Published image event for ${objectKey}`
    );
  }
}

listB2Objects()
  .catch((error) => {
    console.error("B2 polling failed:", error);
    process.exit(1);
  });