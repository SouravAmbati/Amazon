import { ApiError } from "./ApiError.js";

export class ForbiddenError extends ApiError {

    constructor(message) {

        super(403, message);

    }

}