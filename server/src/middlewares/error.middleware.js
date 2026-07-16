import { ApiError } from "../shared/errors/ApiError.js";

export function errorHandler(
    error,
    req,
    res,
    next
) {

    if(error instanceof ApiError){

        return res.status(error.statusCode).json({

            success:false,

            message:error.message

        });

    }

    console.error(error);

    return res.status(500).json({

        success:false,

        message:"Internal Server Error"

    });

}