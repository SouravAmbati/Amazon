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
export async function getBrands(req, res, next) {
    try {

        const result = await brandService.getBrands();

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
export async function getBrandBySlug(req, res, next) {
    try {

        const result =
            await brandService.getBrandBySlug(
                req.params.slug
            );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
export async function updateBrand(req, res, next) {
    try {

        const result = await brandService.updateBrand(
            req.params.id,
            req.validated
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
export async function deleteBrand(req, res, next) {
    try {

        const result = await brandService.deleteBrand(
            req.params.id
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}