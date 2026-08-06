import { prisma } from "../../config/Prisma.js";
import { BRAND_SELECT } from "../../shared/constants/brand-select.js";
import { BadRequestError } from "../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { ensureUniqueSlug } from "../../shared/services/slug.service.js";
import { generateSlug } from "../../shared/utils/slug.utils.js";


export async function createBrand(data){
    console.log(data);

    const slug = await ensureUniqueSlug(
    "brand",
    data.name
);

    const existing =
        await prisma.brand.findUnique({
            where:{
                slug,
            },
        });

    if(existing){
        throw new BadRequestError(
            "Brand already exists."
        );
    }

    const brand =
        await prisma.brand.create({

            data:{
                ...data,
                slug,
            },

            select:BRAND_SELECT,

        });

    return{

        success:true,

        message:"Brand created successfully.",

        data:brand,

    };

}
export async function getBrands() {

    const brands = await prisma.brand.findMany({
        select: BRAND_SELECT,
        orderBy: {
            name: "asc",
        },
    });

    return {
        success: true,
        data: brands,
    };
}
export async function getBrandBySlug(slug) {

    const brand = await prisma.brand.findUnique({
        where: {
            slug,
        },
        select: BRAND_SELECT,
    });

    if (!brand) {
        throw new NotFoundError("Brand not found.");
    }

    return {
        success: true,
        data: brand,
    };
}
export async function updateBrand(brandId, data) {

    const existingBrand = await prisma.brand.findUnique({
        where: {
            id: brandId,
        },
    });

    if (!existingBrand) {
        throw new NotFoundError("Brand not found.");
    }

    if (data.name) {

        const slug = generateSlug(data.name);

        const duplicateBrand = await prisma.brand.findUnique({
            where: {
                slug,
            },
        });

        if (duplicateBrand && duplicateBrand.id !== brandId) {
            throw new BadRequestError("Brand already exists.");
        }

        data.slug = slug;
    }

    const updatedBrand = await prisma.brand.update({
        where: {
            id: brandId,
        },
        data,
        select: BRAND_SELECT,
    });

    return {
        success: true,
        message: "Brand updated successfully.",
        data: updatedBrand,
    };
}
export async function deleteBrand(brandId) {

    const brand = await prisma.brand.findUnique({
        where: {
            id: brandId,
        },
    });

    if (!brand) {
        throw new NotFoundError("Brand not found.");
    }

    const productCount = await prisma.product.count({
        where: {
            brandId,
        },
    });

    if (productCount > 0) {
        throw new ConflictError(
            "Cannot delete brand because products are assigned to it."
        );
    }

    await prisma.brand.delete({
        where: {
            id: brandId,
        },
    });

    return {
        success: true,
        message: "Brand deleted successfully.",
    };
}