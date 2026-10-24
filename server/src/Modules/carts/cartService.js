
import redis from "../../config/redis.js";
import {
    AddToCartRepository,
    RemoveFromCartRepository,
    IncreaseCountRepository,
    GetCartRepository
} from "./cartRepository.js";

export async function AddToCartService(
  productId,
  counts,
  userId
) {
  const response = await AddToCartRepository(
    productId,
    counts,
    userId
  );
  try {
    const key = `cart:${userId}:product:${productId}`;

    await redis.set(
      key,
      response.result,
      { ex: 3600 }
    );
    console.log("Cart added successfully to Redis");
  } catch (error) {
    console.error("Redis cache error:", error.message);
    throw error;
  }

  return response;
}

export async function RemoveFromCartService(
    productId,
    userId
) {
    // 1. Remove the product from PostgreSQL.
    const response = await RemoveFromCartRepository(
        productId,
        userId
    );

    try {
        const productKey =
            `cart:${userId}:product:${productId}`;

        await redis.del(productKey);

        console.log("Deleted product from Redis cache");

        const cartKey = `cart:${userId}:items`;

        await redis.del(cartKey);

        console.log("Full cart cache cleared");
    } catch (error) {
        console.error(
            "Redis cache deletion failed:",
            error.message
        );
    }

    return response;
}

export async function IncreaseCountService(
    productId,
    counts,
    userId
) {
    const response = await IncreaseCountRepository(
        productId,
        counts,
        userId
    );

    const key = `cart:${userId}:product:${productId}`;

    try {
        await redis.del(key);
        console.log("Old cart cache deleted");

        await redis.set(
            key,
            response.result,
            { ex: 3600 }
        );

        console.log("Cart quantity updated in Redis successfully");
    } catch (error) {
        console.error("Redis cache update failed:", error.message);
    }

    return response;
}
export async function GetCartService(userId) {
    const dbCart = await GetCartRepository(userId);

    if (!dbCart.success) {
        return dbCart;
    }

    const cartItems = await Promise.all(
        dbCart.data.map(async (product) => {
            const key =
                `cart:${userId}:product:${product.product_id}`;

            try {
                const cachedProduct = await redis.get(key);

                if (cachedProduct !== null) {
                    console.log(
                        `Product ${product.product_id} fetched from Redis`
                    );
                    return {
                        ...product,
                        counts: cachedProduct.counts
                    };
                }
            } catch (error) {
                console.error(
                    `Redis read failed for product ${product.product_id}:`,
                    error.message
                );
            }
            console.log(
                `Product ${product.product_id} fetched from PostgreSQL`
            );

            try {
                await redis.set(
                    key,
                    {
                        ...product
                    },
                    { ex: 3600 }
                );
            } catch (error) {
                console.error(
                    `Redis cache refresh failed for product ${product.product_id}:`,
                    error.message
                );
            }

            return product;
        })
    );

    return {
        success: true,
        data: cartItems
    };
}

