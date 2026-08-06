import { prisma } from "../../config/Prisma.js";
import { BRAND_SELECT } from "../../shared/constants/brand-select.js";
import { BadRequestError } from "../../shared/errors/BadRequestError.js";
import { generateSlug } from "../../shared/utils/slug.utils.js";


export async function createBrand(data){
    console.log(data);

    const slug = generateSlug(data.name);

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