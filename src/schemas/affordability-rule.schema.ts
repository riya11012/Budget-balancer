import { z } from "zod";

export const affordabilityRuleSchema =
  z.object({
    salaryPercentage:
      z.coerce.number().min(1).max(100),

    savingsPercentage:
      z.coerce.number().min(1).max(100),

    protectEmergencyFund:
      z.boolean(),
  });

export type AffordabilityRuleInput =
  z.infer<
    typeof affordabilityRuleSchema
  >;