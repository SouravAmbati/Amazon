import { getIO } from "../../config/socket.js";
import { CompletePaidOrder } from "../../utils/orderPaymentService.js";
import { Payment } from "../../utils/StripePayment.js";
import {
    addOrderService,
    getOrdersService,
    getOrderStatusService,
    updateOrderStatusService
} from "./orderService.js";


export const addOrderController = async (req, res) => {

    try {

        const {
            productId,
            quantity,
            paymentMethod,
            amount
        } = req.body;
        const userId = req.user.id;
        if (!quantity || Number(quantity) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });

        }


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
                await addOrderService(productId,quantity,userId,false);


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
                    productId,
                    quantity,
                    userId
                );
            if(response){
                CompletePaidOrder(response.result.id);
            }


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
        const response = await getOrdersService(req.user.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function updateOrderStatusController(req, res) {
    try {
        const { orderId, status } = req.body;

        const result = await updateOrderStatusService(
            orderId,
            status
        );
        getIO()
            .to(`order:${String(orderId)}`)
            .emit("orderStatusUpdated", {
                orderId: String(orderId),
                status: result.result.status
            });

        return res.status(200).json(result);
    } catch (error) {
        console.error("Update order status error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update order status"
        });
    }
}
export const getOrderStatusController = async (
    req,
    res
) => {

    try {

        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const response =
            await getOrderStatusService(
                orderId
            );

        return res.status(200).json(
            response
        );

    } catch (error) {

        console.error(
            "Get order status error:",
            error
        );

        if (
            error.message ===
            "Order not found"
        ) {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};