import { getProductByIdRepository, getProductsRepository } from "./ProductRepository.js";


export async function getProductService(cursor){
    return await getProductsRepository(cursor);
}
export async function getProductByIdService(productid){
    return await getProductByIdRepository(productid);
}