import { getAllOrdersService } from "./AdminService.js";



export const getAllOrdersController = async (req, res) => {
    try {
        const response = await getAllOrdersService();

        return res.status(200).json(response);
    } catch (error) {
        console.error("Get all admin orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
        });
    }
};
