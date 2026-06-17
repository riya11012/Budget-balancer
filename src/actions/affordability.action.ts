"use server";

import { auth } from "../auth";
import { evaluatePurchase } from "../repositories/affordability.repository";

export async function checkAffordability(data: {
  itemName: string;
  description?: string;
  category: string;
  price: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return evaluatePurchase(
    session.user.id,
    data
  );
}