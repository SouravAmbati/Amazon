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
export async function getAddresses(req, res, next) {
    try {
        const result = await addressService.getAddresses(req.user.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
export async function getAddress(req, res, next) {
    try {
        const result = await addressService.getAddress(
            req.user.id,
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
export async function updateAddress(req, res, next) {
    try {
        const result = await addressService.updateAddress(
            req.user.id,
            req.params.id,
            req.validated
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
export async function deleteAddress(req, res, next) {
    try {
        const result = await addressService.deleteAddress(
            req.user.id,
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
export async function setDefaultAddress(req, res, next) {
    try {
        const result = await addressService.setDefaultAddress(
            req.user.id,
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}