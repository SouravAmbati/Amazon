import { addOrderRepository, getOrdersRepository, getOrderStatusRepository, updateOrderStatusRepository } from "./orderRepository.js";




export async function addOrderService(
    productId,
    quantity,
    userId,
    clearCart = true
) {
    if (!productId) {
        throw new Error("Product ID is required");
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        throw new Error("Quantity must be a positive integer");
    }

    if (!userId) {
        throw new Error("Authenticated user is required");
    }

    return addOrderRepository(
        productId,
        Number(quantity),
        userId,
        clearCart
    );
}


export async function getOrdersService(userId) {
    if (!userId) throw new Error("Authenticated user is required");

    return getOrdersRepository(userId);
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
