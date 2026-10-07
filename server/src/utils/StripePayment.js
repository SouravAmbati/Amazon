import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";

export async function Payment(orderId, amount, origin) {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: "ShopZone Order",
                    },
                    unit_amount: Math.round(Number(amount) * 100),
                },
                quantity: 1,
            },
        ],

        mode: "payment",

        success_url:
            `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,

        cancel_url:
            `${origin}/payment-cancelled?orderId=${orderId}`,

        metadata: {
            orderId: String(orderId),
        },
    });

    return session;
}