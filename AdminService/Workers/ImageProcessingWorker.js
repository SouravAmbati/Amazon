import sharp from "sharp";
import pool from "../db/connection.js";
import S3client from "../config/s3Connection.js";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.B2_BUCKET_NAME;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function waitForImage(key, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      await S3client.send(
        new HeadObjectCommand({
          Bucket: BUCKET,
          Key: key,
        })
      );

      return true;
    } catch (error) {
      const status = error?.$metadata?.httpStatusCode;

      if (
        status !== 404 &&
        error?.name !== "NotFound" &&
        error?.name !== "NoSuchKey"
      ) {
        throw error;
      }
    }

    await sleep(5000);
  }

  throw new Error(`Timed out waiting for image: ${key}`);
}

async function downloadImage(key) {
  const response = await S3client.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`Empty response body for ${key}`);
  }

  return Buffer.from(
    await response.Body.transformToByteArray()
  );
}

async function uploadImage(key, buffer, contentType) {
  await S3client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}

async function processImage(originalKey) {
  await waitForImage(originalKey);

  const originalBuffer = await downloadImage(originalKey);

  const lastDot = originalKey.lastIndexOf(".");
  const baseKey =
    lastDot > originalKey.lastIndexOf("/")
      ? originalKey.slice(0, lastDot)
      : originalKey;

  const versions = [
    { suffix: "thumbnail", width: 150, height: 150 },
    { suffix: "medium", width: 500, height: 500 },
    { suffix: "large", width: 1200, height: 1200 },
  ];

  const results = [];

  for (const version of versions) {
    const outputBuffer = await sharp(originalBuffer)
      .rotate()
      .resize(version.width, version.height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const outputKey = `${baseKey}-${version.suffix}.webp`;

    await uploadImage(
      outputKey,
      outputBuffer,
      "image/webp"
    );

    results.push({
      version: version.suffix,
      key: outputKey,
      size: outputBuffer.length,
    });
  }

  return { originalKey, versions: results };
}

export async function FormatImageVersions(productId, imageKeys) {
  if (!productId) {
    throw new Error("productId is required");
  }

  if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
    throw new Error("imageKeys must be a non-empty array");
  }

  // If even one image fails, the product will not become ACTIVE.
  const results = await Promise.all(
    imageKeys.map(processImage)
  );

  // Runs only after every image version has uploaded successfully.
  const updateResult = await pool.query(
    `UPDATE product
     SET status = $1
     WHERE id = $2
     RETURNING id, status`,
    ["ACTIVE", productId]
  );

  if (updateResult.rowCount === 0) {
    throw new Error(
      `Product ${productId} was not found; status was not updated`
    );
  }

  return {
    product: updateResult.rows[0],
    images: results,
  };
}
