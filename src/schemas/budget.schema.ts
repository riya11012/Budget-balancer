import { z } from "zod";

export const budgetSchema = z.object({
  category: z.string().min(2),

  monthlyLimit: z.coerce
    .number()
    .positive(),
});

export type BudgetInput =
  z.infer<typeof budgetSchema>;