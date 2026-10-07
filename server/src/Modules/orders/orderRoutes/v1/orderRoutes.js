import express from "express";
import { addOrderController, getOrdersController } from "../../orderController.js";



const OrderRouter = express.Router();


OrderRouter.post(
    "/order",
    addOrderController
);


OrderRouter.get(
    "/orders",
    getOrdersController
);


export default OrderRouter;