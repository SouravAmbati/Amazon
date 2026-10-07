import { addOrderRepository, getOrdersRepository } from "./orderRepository.js";



export async function addOrderService(productId) {

    if (!productId) {
        throw new Error("Product ID is required");
    }

    const response = await addOrderRepository(productId);

    return response;
}


export async function getOrdersService() {

    const response = await getOrdersRepository();

    return response;
}