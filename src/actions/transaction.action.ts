"use server";

import { auth } from "../auth";

import { createTransaction } from "../repositories/transaction.repository";

import { revalidatePath }
from "next/cache";

import { createNotification } from "../repositories/notification.repository";

export async function saveTransaction(data: {
  type: string;
  category: string;
  amount: number;
  description?: string;
  transactionDate: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const transaction = await createTransaction(
    session.user.id,
    data.type,
    data.category,
    data.amount,
    data.description || "",
    data.transactionDate
  );

  await createNotification({
    userId: session.user.id,
    type: "TRANSACTION",
    title: "Transaction added",
    message: `${data.type === "income" ? "Income" : "Expense"} of ₹${data.amount} added in ${data.category}.`,
  });

  revalidatePath("/transactions");
  revalidatePath("/dashboard");

  return transaction;
}