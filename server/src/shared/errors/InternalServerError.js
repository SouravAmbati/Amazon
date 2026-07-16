import { ApiError } from "./ApiError.js";

export class InternalServerError extends ApiError {

    constructor(message="Internal Server Error") {

        super(500, message);

    }

}