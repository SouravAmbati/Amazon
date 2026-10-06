import express from "express";
import { AddToCartController, GetCartController, IncreaseProductCountController, RemoveFromCartController } from "../../cartController.js";

const CartRouter=express.Router();
CartRouter.get(
    "/cart",
    GetCartController
);
CartRouter.post('/cart',AddToCartController);
CartRouter.put('/cart',IncreaseProductCountController);
CartRouter.delete('/cart',RemoveFromCartController);
export default CartRouter;