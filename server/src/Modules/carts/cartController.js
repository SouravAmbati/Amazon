
import {
    AddToCartService,
    IncreaseCountService,
    RemoveFromCartService,
    GetCartService
} from "./cartService.js";

export const AddToCartController = async (req, res) => {
    try {
        const { productId } = req.query;
        const { counts } = req.body;
        const userId = req.user.id;

        if (!productId || counts === undefined) {
            return res.status(400).json({
                success: false,
                message: "productId and counts are required"
            });
        }

        const quantity = Number(counts);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "counts must be a positive integer"
            });
        }

        const response = await AddToCartService(
            productId,
            quantity,
            userId
        );

        return res.status(201).json(response);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const RemoveFromCartController = async (req, res) => {
    try {
        const { productId } = req.query;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId is required"
            });
        }

        const response = await RemoveFromCartService(
            productId,
            userId
        );

        return res.status(200).json(response);
    } catch (error) {
        const status = error.message === "Product is not in your cart"
            ? 404
            : 500;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
};


export const IncreaseProductCountController = async (req, res) => {
    try {
        const { productId } = req.query;
        const { counts } = req.body;
        const userId = req.user.id;

        if (!productId || counts === undefined) {
            return res.status(400).json({
                success: false,
                message: "productId and counts are required"
            });
        }

        const quantity = Number(counts);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "counts must be a positive integer"
            });
        }

        const response = await IncreaseCountService(
            productId,
            quantity,
            userId
        );

        return res.status(200).json(response);
    } catch (error) {
        const status = error.message === "Product is not in your cart"
            ? 404
            : 500;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
};


export const GetCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const response = await GetCartService(userId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
