import express from "express";
import { ImplementSearch } from "../searchService.js";

const Workerrouter = express.Router();

Workerrouter.post("/index-product", async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId is required",
            });
        }

        await ImplementSearch(productId);
        console.log("Product indexed successfully");

        return res.status(200).json({
            success: true,
            message: "Product indexed successfully",
        });
    } catch (error) {
        console.error("Worker failed:", error);

        return res.status(500).json({
            success: false,
            message: "Product indexing failed",
        });
    }
});

export default Workerrouter;