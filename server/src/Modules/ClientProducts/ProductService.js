import { getProductByFilterRepository, getProductByIdRepository, getProductsByCategoryRepository, getProductsRepository } from "./ProductRepository.js";


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