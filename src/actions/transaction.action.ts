"use server";

import { auth } from "../auth";

import { createTransaction } from "../repositories/transaction.repository";

import { revalidatePath }
from "next/cache";

export async function saveTransaction(
  data: {
    type: string;
    category: string;
    amount: number;
    description?: string;
    transactionDate: string;
  }
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await createTransaction(
    session.user.id,
    data.type,
    data.category,
    data.amount,
    data.description || "",
    data.transactionDate
  );

  revalidatePath("/transactions");
}