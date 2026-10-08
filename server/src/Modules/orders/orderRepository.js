import { v4 as uuidv4 } from "uuid";
import pool from "../../db/connection.js";

export async function addOrderRepository(
    productId,
    quantity
) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // ---------------------------------------------
        // CREATE ONE ORDER
        // ---------------------------------------------

        const orderResult =
            await client.query(
                `
                INSERT INTO orders(
                    id,
                    product,
                    quantity
                )
                VALUES(
                    $1,
                    $2,
                    $3
                )
                RETURNING
                    id,
                    product,
                    quantity,
                    status,
                    created_at
                `,
                [
                    uuidv4(),
                    productId,
                    quantity
                ]
            );


        const order =
            orderResult.rows[0];


        // ---------------------------------------------
        // REMOVE PRODUCT FROM CART
        // ---------------------------------------------

        await client.query(
            `
            DELETE FROM cart
            WHERE product = $1
            `,
            [productId]
        );


        await client.query("COMMIT");


        return {
            success: true,

            message:
                "Product ordered successfully",

            result: order
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}
export async function getOrdersRepository() {
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT
                o.id AS order_id,
                o.product AS product_id,
                o.quantity,
                o.status,
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
            ORDER BY o.id DESC
        `);

        return {
            success: true,
            data: result.rows
        };

    } catch (error) {
        throw error;

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
