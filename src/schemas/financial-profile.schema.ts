import { z } from "zod";

export const financialProfileSchema = z.object({
  monthlySalary:  z.coerce
  .number(),
  currentSavings: z.coerce
  .number(),
  emergencyFund:  z.coerce
  .number(),
});

export type FinancialProfileInput = z.infer<typeof financialProfileSchema>;