import { getProductByFilterRepository, getProductByIdRepository, getProductsByCategoryRepository, getProductsRepository, searchProductsRepository } from "./ProductRepository.js";


export async function getProductService(cursor){
    return await getProductsRepository(cursor);
}
export async function getProductByIdService(productid){
    return await getProductByIdRepository(productid);
}
export async function getProductByCategoryService(type,limit){
    return await getProductsByCategoryRepository(type,limit);
}
export async function getProductByFilterService(type,limit,price1,price2){
    return await getProductByFilterRepository(type,limit,price1,price2)
}
export async function searchProductsService(
    query,
    limit = 10,
    category = null
) {

    if (!query || !query.trim()) {

        return {
            success: true,
            data: []
        };
    }


    const parsedLimit =
        Number(limit);


    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit <= 0
    ) {
        throw new Error(
            "Invalid limit"
        );
    }


    return await searchProductsRepository(
        query.trim(),
        Math.min(parsedLimit, 20),
        category
    );
}