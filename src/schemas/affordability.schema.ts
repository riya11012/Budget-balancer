import { z } from "zod";

export const affordabilitySchema =
  z.object({
    itemName: z.string().min(2),

    category: z.string().min(2),

    price: z.coerce
      .number()
      .positive(),
  });

export type AffordabilityInput =
  z.infer<typeof affordabilitySchema>;