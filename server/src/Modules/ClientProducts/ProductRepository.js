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


export async function getProductByIdRepository(productid) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
            SELECT
                p.id,
                p.product_name,
                p.category,
                p.sizes,
                p.about_product,
                p.price,
                p.created_at,
                p.color AS color_id,
                c.hashcode AS colors,
                p.img AS image_id,
                i.image_url AS images
            FROM product p
            LEFT JOIN colors c
                ON p.color = c.id
            LEFT JOIN images i
                ON p.img = i.id
            WHERE p.id = $1
            `,
            [productid]
        );

        return {
            success: true,
            data: result.rows.map((product) => ({
                ...product,
                images: product.images || [],
                colors: product.colors ? [product.colors] : [],
            })),
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


export async function getProductsByCategoryRepository(type,limit){
  const client = await pool.connect();
  try {
    const result=await client.query(`
      SELECT
        p.id,
        p.product_name,
        p.price,
        i.image_url AS images
    FROM product p
    INNER JOIN images i
        ON p.img = i.id
    WHERE p.category=$1
    ORDER BY p.id ASC
    LIMIT $2
      `,[type,limit]);
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
export async function getProductByFilterRepository(
    type,
    limit,
    price1,
    price2
) {

    const client = await pool.connect();

    try {

        let result;


        if (price2 === null) {

            result = await client.query(
                `
                SELECT
                    p.id,
                    p.product_name,
                    p.price,
                    i.image_url AS images
                FROM product p
                INNER JOIN images i
                    ON p.img = i.id
                WHERE p.category = $1
                  AND p.price >= $3
                ORDER BY p.id ASC
                LIMIT $2
                `,
                [
                    type,
                    limit,
                    price1,
                ]
            );

        } else {

            result = await client.query(
                `
                SELECT
                    p.id,
                    p.product_name,
                    p.price,
                    i.image_url AS images
                FROM product p
                INNER JOIN images i
                    ON p.img = i.id
                WHERE p.category = $1
                  AND p.price BETWEEN $3 AND $4
                ORDER BY p.id ASC
                LIMIT $2
                `,
                [
                    type,
                    limit,
                    price1,
                    price2,
                ]
            );

        }


        return {
            success: true,
            data: result.rows,
        };


    } catch (error) {

        throw error;

    } finally {

        client.release();

    }

}
export async function searchProductsRepository(
    query,
    limit = 10,
    category = null
) {
    const client = await pool.connect();

    try {

        let result;

        if (category) {

            result = await client.query(
                `
                SELECT
                    p.id,
                    p.product_name,
                    p.category,
                    p.price,
                    i.image_url AS images

                FROM product p

                INNER JOIN images i
                    ON p.img = i.id

                WHERE
                    p.product_name ILIKE $1
                    AND p.category = $2

                ORDER BY
                    p.product_name ASC

                LIMIT $3
                `,
                [
                    `%${query}%`,
                    category,
                    limit
                ]
            );

        } else {

            result = await client.query(
                `
                SELECT
                    p.id,
                    p.product_name,
                    p.category,
                    p.price,
                    i.image_url AS images

                FROM product p

                INNER JOIN images i
                    ON p.img = i.id

                WHERE
                    p.product_name ILIKE $1

                ORDER BY
                    p.product_name ASC

                LIMIT $2
                `,
                [
                    `%${query}%`,
                    limit
                ]
            );
        }


        return {
            success: true,
            data: result.rows
        };

    } finally {

        client.release();

    }
}