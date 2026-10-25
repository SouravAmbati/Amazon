import Stripe from "stripe";
import { CompletePaidOrder } from "../../utils/orderPaymentService.js";
import 'dotenv/config';

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

export async function stripeWebhookController(req, res) {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        if (!signature) {
            return res.status(400).send("Missing Stripe signature");
        }

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.payment_status === "paid") {
                    const orderId = session.metadata?.orderId;

                    if (!orderId) {
                        console.error("Stripe session is missing orderId metadata");
                        return res.status(400).send("Missing orderId metadata");
                    }

                    await CompletePaidOrder(orderId);
                }

                break;
            }

            case "checkout.session.async_payment_succeeded": {
                const session = event.data.object;

                if (session.payment_status === "paid") {
                    const orderId = session.metadata?.orderId;

                    if (!orderId) {
                        console.error("Stripe session is missing orderId metadata");
                        return res.status(400).send("Missing orderId metadata");
                    }

                    await CompletePaidOrder(orderId);
                }

                break;
            }

            case "checkout.session.async_payment_failed": {
                const session = event.data.object;

                console.warn(
                    "Stripe asynchronous payment failed for order:",
                    session.metadata?.orderId
                );

                // Do not clear the cart.
                // You can separately mark the order as failed if your schema supports it.
                break;
            }

            default:
                // Ignore unrelated Stripe events.
                break;
        }

        return res.status(200).json({
            received: true
        });
    } catch (error) {
        console.error("Stripe webhook processing failed:", error);

        // Stripe can retry the webhook when it receives a 5xx response.
        return res.status(500).send("Webhook processing failed");
    }
}
