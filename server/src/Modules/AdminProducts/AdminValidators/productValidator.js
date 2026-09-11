import z from "zod";
export const createProductSchema = z.object({
  product_name: z.string().trim().min(2),
  colors: z.array(z.string().trim().max(7).startsWith("#")),
  sizes: z.array(z.string().trim().max(5)),
  about_product:z.string(),
  price:z.coerce.number().positive().multipleOf(0.01),
  category: z.string().trim().min(2),
});
