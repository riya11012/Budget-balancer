import { z } from "zod";

export const financialProfileSchema = z.object({
  monthlySalary: z.coerce
    .number()
    .min(0, "Monthly salary must be 0 or more"),

  currentSavings: z.coerce
    .number()
    .min(0, "Current savings must be 0 or more"),

  emergencyFund: z.coerce
    .number()
    .min(0, "Emergency fund must be 0 or more"),
});

export type FinancialProfileInput = z.input<
  typeof financialProfileSchema
>;

export type FinancialProfileOutput = z.output<
  typeof financialProfileSchema
>;