import { prisma } from "../../config/Prisma.js";
import { CATEGORY_DETAIL_SELECT } from "../../shared/constants/category-detail-select.js";
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
export async function getCategoryTree() {

    const categories = await prisma.category.findMany({
        select: CATEGORY_SELECT,
        orderBy: {
            name: "asc",
        },
    });

    const categoryMap = new Map();

    categories.forEach(category => {
        categoryMap.set(category.id, {
            ...category,
            children: [],
        });
    });

    const tree = [];

    categories.forEach(category => {

        const node = categoryMap.get(category.id);

        if (!category.parentId) {
            tree.push(node);
            return;
        }

        const parent = categoryMap.get(category.parentId);

        if (parent) {
            parent.children.push(node);
        }

    });

    return {
        success: true,
        data: tree,
    };
}
export async function getCategoryBySlug(slug) {

    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
        select: CATEGORY_DETAIL_SELECT,
    });

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    return {
        success: true,
        data: category,
    };
}