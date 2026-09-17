import z from "zod";
export const cursorSchema = z.object({
  cursor: z
    .string()
    .trim()
    .max(36, "Cursor cannot be longer than 36 characters")
    .uuid("Cursor must be a valid UUID"),
});