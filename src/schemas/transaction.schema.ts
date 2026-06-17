import { z } from "zod";

export const transactionSchema =
  z.object({
    type: z.enum([
      "income",
      "expense",
    ]),

    category: z.string().min(2),

    amount: z.coerce.number().positive(),

    description: z.string().optional(),

    transactionDate: z.string(),
  });

export type TransactionInput =
  z.infer<typeof transactionSchema>;