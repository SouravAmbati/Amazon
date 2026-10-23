
import pool from "../src/db/connection.js";
import algolia, {
    productIndexName,
} from "../src/config/algolia.js";

export async function ImplementSearch(productId) {
    const db = await pool.connect();

    try {
        const result = await db.query(
            `
            SELECT
                id,
                product_name,
                category
            FROM product
            WHERE id = $1
            `,
            [productId]
        );

        if (result.rows.length === 0) {
            throw new Error(`Product not found: ${productId}`);
        }

        const product = result.rows[0];

        const algoliaProduct = {
            objectID: String(product.id),
            productId: String(product.id),
            product_name: product.product_name,
            category: product.category ?? "",
        };

        await algolia.saveObject({
            indexName: productIndexName,
            body: algoliaProduct,
        });

        console.log("Product indexed successfully:", product.id);

        return { success: true, productId: product.id };
    } catch (error) {
        console.error("Algolia indexing failed:", error);
        throw error;
    } finally {
        db.release();
    }
}
