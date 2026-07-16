import { ApiError } from "./ApiError.js";

export class UnauthorizedError extends ApiError {

    constructor(message) {

        super(401, message);

    }

}