import { v4 as uuidv4 } from "uuid";
import pool from "../../db/connection.js";

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
            [idempotencyKey]
        );

        if (idempotencyResult.rowCount === 0) {

            const existingResult = await client.query(
                `
                SELECT status, response
                FROM idempotency_keys
                WHERE key = $1
                FOR UPDATE
                `,
                [idempotencyKey]
            );

            const existing = existingResult.rows[0];

            if (existing.status === "PROCESSING") {
                throw new Error(
                    "This request is already being processed"
                );
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
            [
                colorId,
                colors,
            ]
        );

        await client.query(
            `
            INSERT INTO images(id, image_url)
            VALUES($1, $2)
            `,
            [
                imageId,
                imagesURL,
            ]
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
                price
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
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
            ]
        );

        const response = {
            success: true,
            message: "Product created successfully",
        };

        await client.query(
            `
            UPDATE idempotency_keys
            SET
                status = 'COMPLETED',
                response = $1
            WHERE key = $2
            `,
            [
                response,
                idempotencyKey,
            ]
        );


        await client.query("COMMIT");


        return response;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}