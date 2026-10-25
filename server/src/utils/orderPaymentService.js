import redis from "../config/redis.js";
import pool from "../db/connection.js";

export async function CompletePaidOrder(orderId) {
  const client = await pool.connect();
  let order;

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id, product, user_id, status
             FROM orders
             WHERE id = $1
             FOR UPDATE`,
      [orderId],
    );

    if (result.rowCount === 0) {
      throw new Error("Order not found");
    }

    order = result.rows[0];

    // Mark the order as paid.
    await client.query(
      `UPDATE orders
             SET status = 'paid'
             WHERE id = $1`,
      [orderId],
    );

    // Delete only this user's purchased product.
    await client.query(
      `DELETE FROM cart
             WHERE product = $1
               AND user_id = $2`,
      [order.product, order.user_id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  await redis.del(
    `cart:${order.user_id}:product:${order.product}`,
    `cart:${order.user_id}:items`,
  );

  console.log(`Order ${orderId} paid; cart and Redis cache cleared`);

  return {
    success: true,
    message: "Payment confirmed and cart cleared",
  };
}
