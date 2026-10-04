import pool from "../../db/connection.js";
export async function getProductsRepository(cursor) {
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
    ORDER BY p.id ASC
    LIMIT 32
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
    WHERE p.id>$1
    ORDER BY p.id ASC
    LIMIT 32
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
      hasNextPage:result.rows.length===32
    };
    return response;
  } catch (error) {
    throw error
  } finally{
    client.release();
  }
}
export async function getProductByIdRepository(productid){
  const client = await pool.connect();
  try {
    const result=await client.query("SELECT * FROM product WHERE id=$1",[productid]);
    const response = {
      success: true,
      data:result.rows,
    };
    return response
  } catch (error) {
    throw error
  } finally{
    client.release();
  }
}