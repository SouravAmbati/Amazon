import { addOrderRepository, getOrdersRepository, updateOrderStatusRepository } from "./orderRepository.js";



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
export async function updateOrderStatusService(
    orderId,
    status
) {
    if (!orderId) {
        throw new Error("Order ID is required");
    }

    if (!status) {
        throw new Error("Order status is required");
    }

    return await updateOrderStatusRepository(
        orderId,
        status
    );
}