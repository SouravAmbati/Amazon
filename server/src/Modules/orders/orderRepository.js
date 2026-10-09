import { v4 as uuidv4 } from "uuid";
import pool from "../../db/connection.js";

export async function addOrderRepository(
    productId,
    quantity,
    userId
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO orders (
                id,
                product,
                quantity,
                user_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, product, quantity, status, created_at, user_id`,
            [uuidv4(), productId, quantity, userId]
        );

        // Delete only this user's cart item.
        await client.query(
            `DELETE FROM cart
             WHERE product = $1 AND user_id = $2`,
            [productId, userId]
        );

        await client.query("COMMIT");

        return {
            success: true,
            message: "Product ordered successfully",
            result: result.rows[0],
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function getOrdersRepository(userId) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `SELECT
                o.id AS order_id,
                o.product AS product_id,
                o.quantity,
                o.status,
                o.created_at,
                p.product_name,
                p.price,
                p.category,
                p.sizes,
                i.image_url AS images
             FROM orders o
             INNER JOIN product p ON o.product = p.id
             INNER JOIN images i ON p.img = i.id
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );

        return {
            success: true,
            data: result.rows,
        };
    } finally {
        client.release();
    }
}
const ALLOWED_ORDER_STATUSES = [
    "processing",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
];
export async function updateOrderStatusRepository(
    orderId,
    status
) {
    const client = await pool.connect();

    try {
        if (!ALLOWED_ORDER_STATUSES.includes(status)) {
            throw new Error("Invalid order status");
        }

        const result = await client.query(
            `
            UPDATE orders
            SET status = $1
            WHERE id = $2
            RETURNING
                id,
                product,
                status,
                created_at
            `,
            [status, orderId]
        );

        if (result.rowCount === 0) {
            throw new Error("Order not found");
        }

        return {
            success: true,
            message: "Order status updated successfully",
            result: result.rows[0],
        };
    } finally {
        client.release();
    }
}
export async function getOrderStatusRepository(orderId) {

    const client = await pool.connect();

    try {

        const result =
            await client.query(
                `
                SELECT
                    o.id AS order_id,
                    o.product AS product_id,
                    o.quantity,
                    o.status,
                    o.created_at,

                    p.product_name,
                    p.price,
                    p.category,
                    p.sizes,

                    i.image_url AS images

                FROM orders o

                INNER JOIN product p
                    ON o.product = p.id

                INNER JOIN images i
                    ON p.img = i.id

                WHERE o.id = $1
                `,
                [orderId]
            );


        if (result.rowCount === 0) {

            throw new Error(
                "Order not found"
            );

        }


        return {
            success: true,
            data: result.rows[0]
        };

    } finally {

        client.release();

    }
}
