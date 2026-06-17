"use server";

import { auth } from "../auth";

import {
  createBudget,
} from "../repositories/budget.repository";

export async function saveBudget(
  category: string,
  monthlyLimit: number
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return createBudget(
    session.user.id,
    category,
    monthlyLimit
  );
}