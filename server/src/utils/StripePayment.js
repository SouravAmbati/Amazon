
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";

export async function Payment(orderId, amount, origin) {
    if (!orderId) {
        throw new Error("Order ID is required");
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("A valid payment amount is required");
    }

    const session = await stripe.checkout.sessions.create(
        {
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: "ShopZone Order"
                        },
                        unit_amount: Math.round(numericAmount * 100)
                    },
                    quantity: 1
                }
            ],

            mode: "payment",

            success_url: `${origin}/order/${orderId}?payment=success`,
            cancel_url: `${origin}/order/${orderId}?payment=cancelled`,
            metadata: {
                orderId: String(orderId)
            }
        },
        {
            idempotencyKey: `checkout-order-${orderId}`
        }
    );

    return session;
}

export default stripe;
