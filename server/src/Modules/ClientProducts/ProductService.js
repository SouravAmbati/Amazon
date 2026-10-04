import { getProductsRepository } from "./ProductRepository.js";


export async function getProductService(cursor){
    return await getProductsRepository(cursor);
}