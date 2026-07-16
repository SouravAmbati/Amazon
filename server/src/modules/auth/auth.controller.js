import { authService } from "./auth.service.js";

export async function register(
    req,
    res,
    next
){

    try{

        const result=
            await authService.register(
                req.validated.body
            );

        res.status(201).json(result);

    }

    catch(error){

        next(error);

    }

}