import { v4 as uuidv4 } from "uuid";
import pool from "../../server/src/db/connection.js";

export async function createProductInDB(
  idempotencyKey,
  product_name,
  colors,
  imagesURL,
  sizes,
  about_product,
  price,
  category,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const idempotencyResult = await client.query(
      `
            INSERT INTO idempotency_keys(key, status)
            VALUES($1, 'PROCESSING')
            ON CONFLICT (key) DO NOTHING
            RETURNING key
            `,
      [idempotencyKey],
    );

    if (idempotencyResult.rowCount === 0) {
      const existingResult = await client.query(
        `
                SELECT status, response
                FROM idempotency_keys
                WHERE key = $1
                FOR UPDATE
                `,
        [idempotencyKey],
      );

      const existing = existingResult.rows[0];

      if (existing.status === "PROCESSING") {
        await client.query("ROLLBACK");
        throw new Error("This request is already being processed");
      }

      if (existing.status === "COMPLETED") {
        await client.query("COMMIT");

        return existing.response;
      }
    }

    const colorId = uuidv4();
    const productId = uuidv4();
    const imageId = uuidv4();

    await client.query(
      `
            INSERT INTO colors(id, hashcode)
            VALUES($1, $2)
            `,
      [colorId, colors],
    );

    await client.query(
      `
            INSERT INTO images(id, image_url)
            VALUES($1, $2)
            `,
      [imageId, imagesURL],
    );

    await client.query(
      `
            INSERT INTO product(
                id,
                product_name,
                img,
                color,
                category,
                sizes,
                about_product,
                price,
                status
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `,
      [
        productId,
        product_name,
        imageId,
        colorId,
        category,
        sizes,
        about_product,
        price,
        "NOT-AVAILABLE"
      ],
    );

    const response = {
      success: true,
      message: "Product created successfully",
      productId:productId,
    };

    await client.query(
      `
            UPDATE idempotency_keys
            SET
                status = 'COMPLETED',
                response = $1
            WHERE key = $2
            `,
      [response, idempotencyKey],
    );

    await client.query("COMMIT");

    return response;
  } catch (error) {
    await client.query("ROLLBACK");

    throw new Error("Database failed");
  } finally {
    client.release();
  }
}
export async function getProducts(cursor) {
  let result;
  let response;
  const client = await pool.connect();
  try {
    if(!cursor){
      result = await client.query(`
    SELECT
        p.id,
        p.product_name,
        p.category,
        p.sizes,
        p.about_product,
        p.price,
        p.created_at,
        c.hashcode AS colors,
        c.id AS color_id,
        i.image_url AS images,
        p.img AS image_id
    FROM product p
    INNER JOIN colors c
        ON p.color = c.id
    INNER JOIN images i
        ON p.img = i.id
    WHERE p.status = 'ACTIVE'
    ORDER BY p.id ASC
    LIMIT 5
`,);
 const nextCursor =
    result.rows.length > 0
      ?
        result.rows[result.rows.length - 1].id
      : null;
   
    response = {
      success: true,
      data:result.rows,
      cursor: nextCursor,
      hasNextPage:result.rows.length
    };
    return response
    }
    //fetch all the products
    result = await client.query(`
    SELECT
        p.id,
        p.product_name,
        p.category,
        p.sizes,
        p.about_product,
        p.price,
        p.created_at,
        c.hashcode AS colors,
        c.id AS color_id,
        i.image_url AS images,
        p.img AS image_id
    FROM product p
    INNER JOIN colors c
        ON p.color = c.id
    INNER JOIN images i
        ON p.img = i.id
    WHERE p.id>$1 AND WHERE p.status = 'ACTIVE'
    ORDER BY p.id ASC
    LIMIT 5
`,[cursor]);
    //apply the cursor pagination
     const nextCursor =
    result.rows.length > 0
      ?
        result.rows[result.rows.length - 1].id
      : null;
   
    response = {
      success: true,
      data:result.rows,
      cursor: nextCursor,
      hasNextPage:result.rows.length
    };
    return response;
  } catch (error) {
    throw error
  } finally{
    client.release();
  }
}
export async function updateProductInDB(product_id,image_id,
  color_id,product_name,
  image_urls,colors,category,
  sizes,about_product,price,idempotencyKey
){
  const client=await pool.connect();
  try {
    await client.query("BEGIN");
    const idempotencyResult = await client.query(
      `
      INSERT INTO idempotency_keys(key, status)
      VALUES($1, 'PROCESSING')
      ON CONFLICT (key) DO NOTHING
      RETURNING key
      `,
      [idempotencyKey],
    );

    if (idempotencyResult.rowCount === 0) {
      const existingResult = await client.query(
        `
        SELECT status, response
        FROM idempotency_keys
        WHERE key = $1
        FOR UPDATE
        `,
        [idempotencyKey],
      );

      const existing = existingResult.rows[0];

      if (existing.status === "PROCESSING") {
        await client.query("ROLLBACK");
        throw new Error("This request is already being processed");
      }

      if (existing.status === "COMPLETED") {
        await client.query("COMMIT");

        return existing.response;
      }
    }
    await client.query(`
      UPDATE product
    SET product_name=$1,
    category=$2,
    sizes=$3,
    about_product=$4,
    price=$5
    WHERE id=$6
    `,[product_name,category,sizes,about_product,price,product_id]);
  await client.query(`
        UPDATE images
    SET image_url=$1
    WHERE id=$2
    `,[image_urls,image_id]);
  await client.query(`
      UPDATE colors
    SET hashcode=$1
    WHERE id=$2
    `,[colors,color_id]);
  await client.query("COMMIT");
    const response = {
      success: true,
      message: "Product updated successfully",
    };
    return response
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Database failed");
  }finally{
    client.release();
  }
}