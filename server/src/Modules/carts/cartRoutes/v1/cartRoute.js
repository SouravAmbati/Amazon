import express from "express";
import { AddToCartController, GetCartController, IncreaseProductCountController, RemoveFromCartController } from "../../cartController.js";
import { authorize } from "../../../../middleware/authorize.js";


const CartRouter=express.Router();
CartRouter.get(
    "/cart",
    authorize,
    GetCartController
);
CartRouter.post('/cart',authorize,AddToCartController);
CartRouter.put('/cart',authorize,IncreaseProductCountController);
CartRouter.delete('/cart',authorize,RemoveFromCartController);
export default CartRouter;