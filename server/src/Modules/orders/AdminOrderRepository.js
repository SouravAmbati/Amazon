import pool from "../../db/connection.js";


export async function getAllOrdersRepository() {
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT
                o.id AS order_id,
                o.product AS product_id,
                o.quantity,
                o.status,
                o.created_at,

                u.id AS user_id,
                u.user_name,
                u.user_email,

                p.product_name,
                p.price,
                p.category,
                p.sizes,

                i.image_url AS images

            FROM orders o

            INNER JOIN users u
                ON o.user_id = u.id

            INNER JOIN product p
                ON o.product = p.id

            LEFT JOIN images i
                ON p.img = i.id

            ORDER BY o.created_at DESC
        `);

        return {
            success: true,
            data: result.rows,
        };
    } finally {
        client.release();
    }
}
