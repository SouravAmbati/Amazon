import express from "express";
import { addOrderController, getOrdersController, getOrderStatusController, updateOrderStatusController } from "../../orderController.js";
import { authorize } from "../../../../middleware/authorize.js";
import { getAllOrdersController } from "../../AdminOrderController.js";



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
    updateOrderStatusController
);

OrderRouter.get(
    "/order/status",
    getOrderStatusController
);

OrderRouter.get(
    "/admin-orders",
    getAllOrdersController
);

export default OrderRouter;