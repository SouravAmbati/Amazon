import { addOrderRepository, getOrdersRepository, getOrderStatusRepository, updateOrderStatusRepository } from "./orderRepository.js";



export async function addOrderService(
    productId,
    quantity
) {

    if (!productId) {
        throw new Error("Product ID is required");
    }

    if (!quantity || Number(quantity) <= 0) {
        throw new Error("Quantity must be greater than 0");
    }

    return await addOrderRepository(
        productId,
        Number(quantity)
    );
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
export async function getOrderStatusService(orderId) {

    if (!orderId) {
        throw new Error("Order ID is required");
    }

    return await getOrderStatusRepository(orderId);
}
