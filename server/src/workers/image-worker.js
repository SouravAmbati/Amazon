import "dotenv/config";
import pool from "../db/pool.js";
import { getObject } from "../storage/get-objects.js";
import { getRabbitMQChannel } from "../Queue/rabbitmq.js";
import { bodyToBuffer } from "../storage/read-object.js";
import { detectFileType } from "../storage/detect-type.js";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
async function processImage(event) {
  console.log(`Processing image ${event.imageId}`);

  console.log(`Storage key: ${event.storageKey}`);

  // 1. Confirm image still exists in DB
  const imageResult = await pool.query(
    `
    SELECT
      id,
      product_id,
      storage_key,
      status
    FROM product_images
    WHERE id = $1
    `,
    [event.imageId],
  );

  if (imageResult.rowCount === 0) {
    throw new Error(`Image ${event.imageId} not found`);
  }

  const image = imageResult.rows[0];
  console.log("DATABASE IMAGE:");

  // 2. Make sure the event matches the DB
  if (image.storage_key !== event.storageKey) {
    throw new Error("Storage key does not match database");
  }

  // 3. Claim the image
  const updateResult = await pool.query(
    `
  UPDATE product_images
  SET
    mime_type = $2,
    file_size = $3,
    width = $4,
    height = $5,
    updated_at = NOW()
  WHERE id = $1;
  `,
    [
      event.imageId,
      fileType.mime,
      object.ContentLength ?? buffer.length,
      metadata.width,
      metadata.height,
    ],
  );

  if (updateResult.rowCount === 0) {
    console.log(`Image ${image.id} is no longer PENDING`);

    return;
  }

  // 4. Get actual object from B2
  const object = await getObject(event.storageKey);
  const buffer = await bodyToBuffer(object.Body);

  const fileType = await detectFileType(buffer);
  const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

  if (!allowedMimeTypes.has(fileType.mime)) {
    throw new Error(`Unsupported image type: ${fileType.mime}`);
  }
  const metadata = await inspectImage(buffer);

  console.log("Image metadata:", metadata);
  if (object.ContentLength && object.ContentLength > MAX_IMAGE_SIZE) {
    throw new Error("Image exceeds maximum allowed size");
  }

  console.log("Detected file:", fileType);
  console.log("B2 object found");

  console.log({
    contentType: object.ContentType,
    contentLength: object.ContentLength,
    etag: object.ETag,
  });

  // For now, just prove we can read it.
  await object.Body?.transformToByteArray();

  console.log(`Image ${image.id} successfully read from B2`);

  // 5. For now, mark READY
  await pool.query(
    `
    UPDATE product_images
    SET
      status = 'READY',
      updated_at = NOW()
    WHERE id = $1;
    `,
    [image.id],
  );

  console.log(`Image ${image.id} is READY`);
}

async function startWorker() {
  const channel = await getRabbitMQChannel();

  await channel.assertQueue("image.processing", {
    durable: true,
  });

  channel.prefetch(1);

  console.log("Image worker waiting for messages...");

  channel.consume("image.processing", async (message) => {
    if (!message) {
      return;
    }

    try {
      const event = JSON.parse(message.content.toString());

      console.log("Received:", event);

      await processImage(event);

      channel.ack(message);

      console.log("RabbitMQ message acknowledged");
    } catch (error) {
      console.error("Image processing failed:", error);

      channel.nack(message, false, false);
    }
  });
}

startWorker().catch((error) => {
  console.error("Image worker failed:", error);

  process.exit(1);
});
