import * as brandService from "./brand.service.js";
export async function createBrand(req,res,next){

    try{

        const result =
            await brandService.createBrand(
                req.validated
            );

        res.status(201).json(result);

    }

    catch(error){

        next(error);

    }

}