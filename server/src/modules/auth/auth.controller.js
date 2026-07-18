import { authService } from "./auth.service.js";
import { validate } from "../../middlewares/validation.middleware.js";

export async function register(
    req,
    res,
    next
){

    try{

        const result=
            await authService.register(
                req.validated
            );

        res.status(201).json(result);

    }

    catch(error){

        next(error);

    }

}