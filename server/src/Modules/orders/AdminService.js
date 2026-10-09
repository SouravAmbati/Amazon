import { getAllOrdersRepository } from "./AdminOrderRepository.js";


export async function getAllOrdersService() {
    return await getAllOrdersRepository();
}
