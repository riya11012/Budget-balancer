import { z } from "zod";

export const wishlistSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  productUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  category: z.string().min(2, "Category is required"),
  targetPrice: z.coerce.number().positive("Price must be greater than 0"),
  priority: z.enum(["low", "medium", "high"]),
});

export type WishlistInput = z.infer<typeof wishlistSchema>;