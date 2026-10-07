import {
    addOrderService,
    getOrdersService
} from "./orderService.js";


export const addOrderController = async (req, res) => {

    try {

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const response = await addOrderService(productId);

        return res.status(201).json(response);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
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