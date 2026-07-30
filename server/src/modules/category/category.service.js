import { prisma } from "../../config/Prisma.js";
import { CATEGORY_SELECT } from "../../shared/constants/category.select.js";
import { BadRequestError } from "../../shared/errors/BadRequestError.js";
import { generateSlug } from "./category.utils.js";

export async function createCategory(data) {

    const slug = generateSlug(data.name);

    const existingCategory =
        await prisma.category.findUnique({
            where: {
                slug,
            },
        });

    if (existingCategory) {
        throw new BadRequestError(
            "Category already exists."
        );
    }

    if (data.parentId) {

        const parent =
            await prisma.category.findUnique({
                where: {
                    id: data.parentId,
                },
            });

        if (!parent) {
            throw new BadRequestError(
                "Parent category not found."
            );
        }
    }

    const category =
        await prisma.category.create({
            data: {
                ...data,
                slug,
            },
           select: CATEGORY_SELECT,
        });

    return {
        success: true,
        message: "Category created successfully.",
        data: category,
    };
}