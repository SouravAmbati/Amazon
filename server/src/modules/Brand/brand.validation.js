import { z } from "zod";

export const createBrandSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    logo: z
        .string()
        .trim()
        .url()
        .optional(),
});
export const updateBrandSchema =
    createBrandSchema
        .partial()
        .refine(
            data => Object.keys(data).length > 0,
            {
                message:
                    "At least one field is required.",
            }
        );