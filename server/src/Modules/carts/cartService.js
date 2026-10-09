
import {
    AddToCartRepository,
    RemoveFromCartRepository,
    IncreaseCountRepository,
    GetCartRepository
} from "./cartRepository.js";

export async function AddToCartService(
    productId,
    counts,
    userId
) {
    return AddToCartRepository(productId, counts, userId);
}

export async function RemoveFromCartService(
    productId,
    userId
) {
    return RemoveFromCartRepository(productId, userId);
}

export async function IncreaseCountService(
    productId,
    counts,
    userId
) {
    return IncreaseCountRepository(productId, counts, userId);
}

export async function GetCartService(userId) {
    return GetCartRepository(userId);
}
