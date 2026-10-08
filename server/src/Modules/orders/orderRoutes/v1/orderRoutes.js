import express from "express";
import { addOrderController, getOrdersController, getOrderStatusController, updateOrderStatusController } from "../../orderController.js";



const OrderRouter = express.Router();


OrderRouter.post(
    "/order",
    addOrderController
);


OrderRouter.get(
    "/orders",
    getOrdersController
);

OrderRouter.patch(
    "/order/status",
    updateOrderStatusController
);

OrderRouter.get(
    "/order/status",
    getOrderStatusController
);

export default OrderRouter;