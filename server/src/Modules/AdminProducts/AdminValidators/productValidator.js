import z from "zod";
export const createProductSchema = z.object({
  product_name: z.string().trim().min(2),
  colors: z.array(z.string().trim().max(7).startsWith("#")),
  sizes: z.array(z.string().trim().max(5)),
  about_product:z.string(),
  price:z.coerce.number().positive().multipleOf(0.01),
  category: z.string().trim().min(2),
});
export const updateProductSchema = z
  .object({
    product_name: z.string().trim().min(2),

    colors: z.array(
      z.string().trim().max(7).startsWith("#")
    ),

    sizes: z.array(
      z.string().trim().max(5)
    ),

    about_product: z.string(),

    price: z.coerce.number().positive().multipleOf(0.01),

    category: z.string().trim().min(2),
  })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );
