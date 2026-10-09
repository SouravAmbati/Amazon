import express from "express";
import { addOrderController, getOrdersController, getOrderStatusController, updateOrderStatusController } from "../../orderController.js";
import { authorize } from "../../../../middleware/authorize.js";



const OrderRouter = express.Router();


OrderRouter.post(
    "/order",
    authorize,
    addOrderController
);


OrderRouter.get(
    "/orders",
    authorize,
    getOrdersController
);

OrderRouter.patch(
    "/order/status",
    authorize,
    updateOrderStatusController
);

OrderRouter.get(
    "/order/status",
    authorize,
    getOrderStatusController
);

export default OrderRouter;