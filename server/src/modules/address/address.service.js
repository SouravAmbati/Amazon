import { prisma } from "../../config/Prisma.js";
import { ADDRESS_SELECT } from "../../shared/constants/address-select.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";

export async function createAddress(userId, data) {
  await prisma.$transaction(async (tx) => {
    const count = await tx.address.count({
      where: { userId },
    });

    return tx.address.create({
      data: {
        ...data,
        userId,
        isDefault: count === 0,
      },
    });
  });

  return {
    success: true,
    message: "Address created successfully.",
    data: address,
  };
}
export async function getAddresses(userId) {
    const addresses = await prisma.address.findMany({
        where: {
            userId,
        },
        select: ADDRESS_SELECT,
        orderBy: [
            {
                isDefault: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    return {
        success: true,
        data: addresses,
    };
}
export async function getAddress(userId, addressId) {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
        select: ADDRESS_SELECT,
    });

    if (!address) {
        throw new NotFoundError("Address not found.");
    }

    return {
        success: true,
        data: address,
    };
}