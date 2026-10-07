import { Payment } from "../../utils/StripePayment.js";
import {
    addOrderService,
    getOrdersService
} from "./orderService.js";


export const addOrderController = async (req, res) => {

    try {

        const {
            productId,
            paymentMethod,
            amount
        } = req.body;


        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });

        }


        if (!paymentMethod) {

            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });

        }

        if (paymentMethod === "stripe") {

            if (!amount) {

                return res.status(400).json({
                    success: false,
                    message: "Amount is required for Stripe payment"
                });

            }


            // Create order first
            const order =
                await addOrderService(productId);


            if (!order.success) {

                return res.status(400).json({
                    success: false,
                    message: "Failed to create order"
                });

            }


            const origin =
                req.headers.origin ||
                `${req.protocol}://${req.get("host")}`;


            const session =
                await Payment(
                    order.result.id,
                    amount,
                    origin
                );


            return res.status(201).json({

                success: true,

                paymentMethod: "stripe",

                orderId:
                    order.result.id,

                sessionId:
                    session.id,

                url:
                    session.url
            });

        }


        if (paymentMethod === "cod") {

            const response =
                await addOrderService(
                    productId
                );


            return res
                .status(201)
                .json({

                    ...response,

                    paymentMethod: "cod"

                });

        }
        return res.status(400).json({

            success: false,

            message:
                "Invalid payment method"

        });


    } catch (error) {

        console.error(
            "Add order error:",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error.message

        });

    }
};


export const getOrdersController = async (req, res) => {

    try {

        const response = await getOrdersService();

        return res.status(200).json(response);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};