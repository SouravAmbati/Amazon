import pool from "../../db/pool.js";
import crypto from "crypto";
import { createUploadUrl } from "../../storage/create-upload-url.js";

export async function createProduct(req, res) {
  const client = await pool.connect();

  try {
    const { name, description, price } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        error: "name must be a non-empty string",
      });
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        error: "price must be a non-negative number",
      });
    }
    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        error: "description must be a string",
      });
    }

    await client.query("BEGIN");

    const productResult = await client.query(
      `
      INSERT INTO products (
        name,
        description,
        price
      )
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [name, description ?? null, price],
    );

    const product = productResult.rows[0];

    await client.query(
      `
      INSERT INTO inventory (
        product_id,
        quantity,
        reserved_quantity
      )
      VALUES ($1, 0, 0);
      `,
      [product.id],
    );

    await client.query(
      `
      INSERT INTO outbox_events (
        event_type,
        aggregate_type,
        aggregate_id,
        payload
      )
      VALUES ($1, $2, $3, $4);
      `,
      [
        "PRODUCT_CREATED",
        "PRODUCT",
        product.id,
        JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
      ],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      product,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      error: "Failed to create product",
    });
  } finally {
    client.release();
  }
}

export async function createProductImageUpload(req, res) {
  const { productId } = req.params;

  const { filename, contentType } = req.body;

  if (typeof filename !== "string" || filename.trim() === "") {
    return res.status(400).json({
      error: "filename is required",
    });
  }

  if (typeof contentType !== "string" || !contentType.startsWith("image/")) {
    return res.status(400).json({
      error: "contentType must be an image type",
    });
  }

  const client = await pool.connect();

  try {
    const productResult = await client.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
      `,
      [productId],
    );

    if (productResult.rowCount === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const imageId = crypto.randomUUID();

    const storageKey = `products/${productId}/images/${imageId}/original`;

    const imageResult = await client.query(
      `
      INSERT INTO product_images (
        id,
        product_id,
        original_storage_key,
        original_filename,
        mime_type,
        sort_order,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [imageId, productId, storageKey, filename, contentType, 0, 0, "PENDING"],
    );

    const image = imageResult.rows[0];

    const uploadUrl = await createUploadUrl({
      key: storageKey,
      contentType,
    });

    return res.status(201).json({
      image,
      uploadUrl: uploadUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create image upload",
    });
  } finally {
    client.release();
  }
}
