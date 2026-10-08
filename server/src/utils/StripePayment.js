import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

const currency = "inr";


export async function Payment(
    orderId,
    amount,
    origin
) {

    const session =
        await stripe.checkout.sessions.create({

            line_items: [
                {
                    price_data: {
                        currency,

                        product_data: {
                            name: "ShopZone Order"
                        },

                        unit_amount:
                            Math.round(
                                Number(amount) * 100
                            )
                    },

                    quantity: 1
                }
            ],

            mode: "payment",

            // -----------------------------------------
            // STRIPE SUCCESS
            // -----------------------------------------

            success_url:
                `${origin}/order/${orderId}?payment=success`,

            // -----------------------------------------
            // STRIPE CANCEL
            // -----------------------------------------

            cancel_url:
                `${origin}/order/${orderId}?payment=cancelled`,

            metadata: {
                orderId: String(orderId)
            }
        });


    return session;
}