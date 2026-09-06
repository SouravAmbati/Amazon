import { createProductInDB } from "./UploadProduct.Repository.js";

export async function createProductService(product_name, colors,imagesURL, sizes, about_product, price,category) {
    return await createProductInDB(product_name, colors,imagesURL, sizes, about_product, price,category)
}