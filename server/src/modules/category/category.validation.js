import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    image: z
        .string()
        .trim()
        .url()
        .optional(),

    parentId: z
        .string()
        .trim()
        .cuid()
        .optional(),
});