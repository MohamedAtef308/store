import { z, ZodSchema } from "zod";

export const productSchema = z.object({
  name: z.string().min(4, { message: "name must be at least 4 characters" }),
  company: z
    .string()
    .min(4, { message: "company must be at least 4 characters" }),
  price: z.coerce
    .number()
    .int()
    .min(0, { message: "price must be a positive number" }),
  description: z.string().refine(
    (description) => {
      const words = description.split(" ").length;
      return words >= 10 && words <= 1000;
    },
    { message: "description must be between 10 and 1000 words" }
  ),
  featured: z.coerce.boolean(),
});


export function validateZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.errors.map( (error)=> error.message);
        throw new Error(errors.join(","))
    }
    return result.data;
}