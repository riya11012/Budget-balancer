"use server";

import { auth } from "../auth";

import {
  upsertAffordabilityRule,
} from "../repositories/affordability-rule.repository";

export async function saveRule(
  salaryPercentage: number,
  savingsPercentage: number,
  protectEmergencyFund: boolean
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return upsertAffordabilityRule(
    session.user.id,
    salaryPercentage,
    savingsPercentage,
    protectEmergencyFund
  );
}