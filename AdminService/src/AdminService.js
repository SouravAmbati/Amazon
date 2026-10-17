import { createProductInDB } from "./AdminRepository.js";


export async function createProductService(idempotencyKey,product_name, colors,imagesURL, sizes, about_product, price,category) {
    return await createProductInDB(idempotencyKey,product_name, colors,imagesURL, sizes, about_product, price,category)
}