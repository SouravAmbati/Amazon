import { createProductInDB, getProducts, updateProductInDB } from "./AdminProduct.Repository.js";

export async function createProductService(idempotencyKey,product_name, colors,imagesURL, sizes, about_product, price,category) {
    return await createProductInDB(idempotencyKey,product_name, colors,imagesURL, sizes, about_product, price,category)
}
export async function getAllTheProducts(cursor){
    return await getProducts(cursor);
}
export async function updateProductService(product_id,image_id,
  color_id,product_name,
  image_urls,colors,category,
  sizes,about_product,price,idempotencyKey){
    return await updateProductInDB(product_id,image_id,
  color_id,product_name,
  image_urls,colors,category,
  sizes,about_product,price,idempotencyKey);
}