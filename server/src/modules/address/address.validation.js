import { z } from "zod";

export const createAddressSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2)
        .max(100),

    phone: z
        .string()
        .trim()
        .min(10)
        .max(15),

    country: z
        .string()
        .trim()
        .min(2)
        .max(100),

    addressLine1: z
        .string()
        .trim()
        .min(5)
        .max(255),

    addressLine2: z
        .string()
        .trim()
        .max(255)
        .optional(),

    landmark: z
        .string()
        .trim()
        .max(255)
        .optional(),

    city: z
        .string()
        .trim()
        .min(2)
        .max(100),

    state: z
        .string()
        .trim()
        .min(2)
        .max(100),

    postalCode: z
        .string()
        .trim()
        .min(3)
        .max(20),

    type: z.enum([
        "HOME",
        "WORK",
        "OTHER",
    ]).default("HOME"),
});
export const updateAddressSchema =
    createAddressSchema
        .partial()
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message: "At least one field must be provided.",
            }
        );