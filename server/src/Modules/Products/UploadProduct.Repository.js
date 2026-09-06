import pool from "../../db/connection.js";
import { v4 as uuidv4 } from "uuid";

export async function createProductInDB(
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
    let colorId = uuidv4();
    let productId = uuidv4();
    let imageId = uuidv4();
    await client.query("BEGIN");
    await client.query("INSERT INTO colors(id,hashcode) VALUES($1,$2)", [
      colorId,
      colors,
    ]);
    await client.query("INSERT INTO images(id,image_url) VALUES($1,$2)", [
      imageId,
      imagesURL,
    ]);
    await client.query(
      "INSERT INTO product(id,product_name,img,color,category,sizes,about_product,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        productId,
        product_name,
        imageId,
        colorId,
        category,
        sizes,
        about_product,
        price,
      ]
    );
    await client.query("COMMIT");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
