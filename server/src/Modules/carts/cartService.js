import {
    AddToCartRepository,
    RemoveFromCartRepository,
    IncreaseCountRepository,
    GetCartRepository
} from "./cartRepository.js";


export async function AddToCartService(
    productId,
    counts
) {

    return await AddToCartRepository(
        productId,
        counts
    );

}


export async function RemoveFromCartService(
    productId
) {

    return await RemoveFromCartRepository(
        productId
    );

}


export async function IncreaseCountService(
    productId,
    counts
) {

    return await IncreaseCountRepository(
        productId,
        counts
    );

}


export async function GetCartService() {

    return await GetCartRepository();

}