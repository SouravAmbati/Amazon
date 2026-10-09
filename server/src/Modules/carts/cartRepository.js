
import { v4 as uuidv4 } from "uuid";
import pool from "../../db/connection.js";

// Add a product to the authenticated user's cart
export async function AddToCartRepository(
    productId,
    counts,
    userId
) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
            INSERT INTO cart (
                id,
                product,
                counts,
                user_id
            )
            VALUES ($1, $2, $3, $4)

            ON CONFLICT (user_id, product)
            DO UPDATE SET
                counts = cart.counts + EXCLUDED.counts

            RETURNING
                id,
                product,
                counts,
                user_id;
            `,
            [uuidv4(), productId, counts, userId]
        );

        return {
            success: true,
            message: "Product added to cart successfully",
            result: result.rows[0]
        };
    } finally {
        client.release();
    }
}


// Remove a product only from the authenticated user's cart
export async function RemoveFromCartRepository(
    productId,
    userId
) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
            DELETE FROM cart
            WHERE product = $1
              AND user_id = $2
            RETURNING id, product, user_id;
            `,
            [productId, userId]
        );

        if (result.rowCount === 0) {
            throw new Error("Product is not in your cart");
        }

        return {
            success: true,
            message: "Product removed from cart successfully",
            result: result.rows[0]
        };
    } finally {
        client.release();
    }
}


// Set the quantity for the authenticated user's product
export async function IncreaseCountRepository(
    productId,
    counts,
    userId
) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
            UPDATE cart
            SET counts = $1
            WHERE product = $2
              AND user_id = $3
            RETURNING id, product, counts, user_id;
            `,
            [counts, productId, userId]
        );

        if (result.rowCount === 0) {
            throw new Error("Product is not in your cart");
        }

        return {
            success: true,
            message: "Cart quantity updated successfully",
            result: result.rows[0]
        };
    } finally {
        client.release();
    }
}


// Fetch only the authenticated user's cart
export async function GetCartRepository(userId) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
            SELECT
                c.id AS cart_id,
                c.product AS product_id,
                c.counts,
                p.product_name,
                p.price,
                p.category,
                p.sizes,
                i.image_url AS images
            FROM cart c
            INNER JOIN product p
                ON c.product = p.id
            INNER JOIN images i
                ON p.img = i.id
            WHERE c.user_id = $1
            ORDER BY c.created_at DESC;
            `,
            [userId]
        );

        return {
            success: true,
            data: result.rows
        };
    } finally {
        client.release();
    }
}
