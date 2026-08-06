import { prisma } from "../../config/Prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { generateSlug } from "../utils/slug.utils.js";

export async function ensureUniqueSlug(
    model,
    name
) {
    const slug = generateSlug(name);

    const existing = await prisma[model].findUnique({
        where: { slug },
    });

    if (existing) {
        throw new BadRequestError(`${model} already exists.`);
    }

    return slug;
}