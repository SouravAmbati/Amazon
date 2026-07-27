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
export async function updateAddress(userId, addressId, data) {
    const existingAddress = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
    });

    if (!existingAddress) {
        throw new NotFoundError("Address not found.");
    }

    const updatedAddress = await prisma.address.update({
        where: {
            id: addressId,
        },
        data,
        select: ADDRESS_SELECT,
    });

    return {
        success: true,
        message: "Address updated successfully.",
        data: updatedAddress,
    };
}
export async function deleteAddress(userId, addressId) {
    return prisma.$transaction(async (tx) => {

        const address = await tx.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
        });

        if (!address) {
            throw new NotFoundError("Address not found.");
        }

        await tx.address.delete({
            where: {
                id: addressId,
            },
        });

        if (address.isDefault) {

            const nextAddress =
                await tx.address.findFirst({
                    where: {
                        userId,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                });

            if (nextAddress) {
                await tx.address.update({
                    where: {
                        id: nextAddress.id,
                    },
                    data: {
                        isDefault: true,
                    },
                });
            }
        }

        return {
            success: true,
            message: "Address deleted successfully.",
        };
    });
}
export async function setDefaultAddress(userId, addressId) {
    return prisma.$transaction(async (tx) => {

        const address = await tx.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
        });

        if (!address) {
            throw new NotFoundError("Address not found.");
        }

        await tx.address.updateMany({
            where: {
                userId,
            },
            data: {
                isDefault: false,
            },
        });

        const updatedAddress = await tx.address.update({
            where: {
                id: addressId,
            },
            data: {
                isDefault: true,
            },
            select: ADDRESS_SELECT,
        });

        return {
            success: true,
            message: "Default address updated successfully.",
            data: updatedAddress,
        };
    });
}