import { cursorSchema } from "../AdminProducts/AdminValidators/cursorValidator.js";
import { getProductByCategoryService, getProductByIdService, getProductService } from "./ProductService.js"


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
        console.log(type,limit);
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