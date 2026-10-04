import { cursorSchema } from "../AdminProducts/AdminValidators/cursorValidator.js";
import { getProductService } from "./ProductService.js"


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
        console.log(error);
    }
}