"use server";

import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { createBudget } from "../repositories/budget.repository";

export async function saveBudget(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const category = String(formData.get("category"));
  const monthlyLimit = Number(formData.get("monthlyLimit"));

  if (!category || !monthlyLimit) {
    throw new Error("Invalid budget data");
  }

  await createBudget(
    session.user.id,
    category,
    monthlyLimit
  );

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}