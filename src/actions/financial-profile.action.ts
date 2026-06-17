"use server";

import { auth } from "../auth";

import {
  createFinancialProfile,
  getFinancialProfileByUserId,
  updateFinancialProfile,
} from "../repositories/financial-profile.repository";

type Input = {
  monthlySalary: number;
  currentSavings: number;
  emergencyFund: number;
};

export async function saveFinancialProfile(
  data: Input
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existingProfile =
    await getFinancialProfileByUserId(userId);

  if (existingProfile) {
    return await updateFinancialProfile(
      userId,
      data.monthlySalary,
      data.currentSavings,
      data.emergencyFund
    );
  }

  return await createFinancialProfile(
    userId,
    data.monthlySalary,
    data.currentSavings,
    data.emergencyFund
  );
}