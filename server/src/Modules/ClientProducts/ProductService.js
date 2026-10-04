import { getProductByIdRepository, getProductsByCategoryRepository, getProductsRepository } from "./ProductRepository.js";


export async function getProductService(cursor){
    return await getProductsRepository(cursor);
}
export async function getProductByIdService(productid){
    return await getProductByIdRepository(productid);
}
export async function getProductByCategoryService(type,limit){
    return await getProductsByCategoryRepository(type,limit);
}