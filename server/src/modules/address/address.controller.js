import * as addressService from "./address.service.js";

export async function createAddress(req, res, next) {
    try {
        console.log("req.validated =", req.validated);
        const result =
            await addressService.createAddress(
                req.user.id,
                req.validated
            );

        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
}