import { cursorSchema } from "../AdminProducts/AdminValidators/cursorValidator.js";
import { getProductByCategoryService, getProductByFilterService, getProductByIdService, getProductService } from "./ProductService.js"


export const getProductController = async(req,res)=>{
    try {
        const { cursor } = req.query;
           const body = {
              cursor
            };
          const { data, error } = cursorSchema.safeParse(body);
          if (error) {
              return res
                .status(400)
                .json({ success: false, message: error.issues[0].message });
            }
          const response=await getProductService(data.cursor);
           res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getProductByIdController=async(req,res)=>{
    try {
        const { productid } = req.query;
        if (!productid) {
              return res
                .status(400)
                .json({ success: false, message:"productId Unavailable" });
        }
        const response=await getProductByIdService(productid);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getProductByCategoryController=async(req,res)=>{
    try {
        const { type,limit } = req.query;
        if (!type||!limit) {
              return res
                .status(400)
                .json({ success: false, message:"Request invalid" });
        }
        const response=await getProductByCategoryService(type,limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getProductsByFilterController = async (req, res) => {

    try {

        const { type, limit, price } = req.query;


        if (!type || !limit || !price) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: "Request invalid",
                });

        }


        const splitPrice = price.split("-");

        const price1 = Number(splitPrice[0]);

        const price2 =
            splitPrice[1] === "max"
                ? null
                : Number(splitPrice[1]);


        if (
            Number.isNaN(price1) ||
            (
                price2 !== null &&
                Number.isNaN(price2)
            )
        ) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid price range",
                });

        }


        const response =
            await getProductByFilterService(
                type,
                Number(limit),
                price1,
                price2
            );


        res.status(200).json(response);


    } catch (error) {

        console.error(
            "Filter controller error:",
            error
        );

        res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });

    }

};