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

function validateImageFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ["image/"];
  return z
    .instanceof(File)
    .refine((file) => !file || file.size <= maxUploadSize, {
      message: "File size must be less than 1 MB",
    })
    .refine(
      (file) =>
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type)),
      { message: "File must be an image" }
    );
}

export function validateZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(","));
  }
  return result.data;
}

export const imageSchema = z.object({
  image: validateImageFile(),
});

export const reviewSchema = z.object({
  productId: z
    .string()
    .refine((value) => value !== "", { message: "Product ID can't be empty" }),
  authorName: z
    .string()
    .refine((value) => value !== "", { message: "Author name can't be empty" }),
  authorImageUrl: z.string().refine((value) => value !== "", {
    message: "Author image URL can't be empty",
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: "Rating can't be less than 1" })
    .max(5, { message: "Rating can't be more than 5" }),
  comment: z
    .string()
    .min(10, { message: "A comment cant be less than 10 characters long" })
    .max(1000, { message: "A comment cant be more than 1000 characters long" }),
});
