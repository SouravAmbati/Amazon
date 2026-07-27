import { prisma } from "../../config/Prisma.js";

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
