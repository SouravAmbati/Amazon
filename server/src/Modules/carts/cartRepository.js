import { v4 as uuidv4 } from "uuid";
import pool from "../../db/connection.js";


export async function AddToCartRepository(
    productId,
    counts
) {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            INSERT INTO cart(
                id,
                product,
                counts
            )
            VALUES(
                $1,
                $2,
                $3
            )

            ON CONFLICT (product)

            DO UPDATE SET
                counts =
                    cart.counts +
                    EXCLUDED.counts

            RETURNING
                id,
                product,
                counts
            `,
            [
                uuidv4(),
                productId,
                counts
            ]
        );


        return {
            success: true,

            message:
                "Product added to cart successfully",

            result:
                result.rows[0]
        };

    } catch (error) {

        throw error;

    } finally {

        client.release();

    }

}

export async function RemoveFromCartRepository(
    productId
) {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            DELETE FROM cart
            WHERE product = $1
            RETURNING
                product
            `,
            [productId]
        );


        if (result.rowCount === 0) {

            throw new Error(
                "Product is not in cart"
            );

        }


        return {

            success: true,

            message:
                "Product removed from cart successfully",

            result:
                result.rows[0]

        };

    } catch (error) {

        throw error;

    } finally {

        client.release();

    }

}

export async function IncreaseCountRepository(
    productId,
    counts
) {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            UPDATE cart
            SET counts = $1
            WHERE product = $2
            RETURNING
                id,
                product,
                counts
            `,
            [
                counts,
                productId
            ]
        );


        if (result.rowCount === 0) {

            throw new Error(
                "Product is not in cart"
            );

        }


        return {

            success: true,

            message:
                "Cart quantity updated successfully",

            result:
                result.rows[0]

        };

    } catch (error) {

        throw error;

    } finally {

        client.release();

    }

}

export async function GetCartRepository() {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            SELECT
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

            ORDER BY c.id ASC
            `
        );


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