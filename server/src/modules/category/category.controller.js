import * as categoryService from "./category.service.js";

export async function createCategory(req, res, next) {
    try {
        const result = await categoryService.createCategory(
            req.validated
        );

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}
export async function getCategoryTree(req, res, next) {
    try {

        const result =
            await categoryService.getCategoryTree();

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
export async function getCategoryBySlug(req, res, next) {
    try {

        const result =
            await categoryService.getCategoryBySlug(
                req.params.slug
            );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}