import express from "express";
import { addOrderController, getOrdersController, updateOrderStatusController } from "../../orderController.js";



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

export default OrderRouter;