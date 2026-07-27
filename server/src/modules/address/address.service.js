import { prisma } from "../../config/Prisma.js";
import { ADDRESS_SELECT } from "../../shared/constants/address-select.js";

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