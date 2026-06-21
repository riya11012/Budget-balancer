"use server";

import { auth } from "../auth";
import { revalidatePath } from "next/cache";

import {
  createWishlistItem,
  deleteWishlistItem,
  updateWishlistDecision,
} from "../repositories/wishlist.repository";

import { wishlistSchema } from "../schemas/wishlist.schema";
import { evaluatePurchase } from "../repositories/affordability.repository";
import { getStockRisk } from "../repositories/stock-risk.repository";

export async function addWishlistItem(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = wishlistSchema.safeParse({
    productName: formData.get("productName"),
    productUrl: formData.get("productUrl"),
    category: formData.get("category"),
    targetPrice: formData.get("targetPrice"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    throw new Error("Invalid wishlist data");
  }

  await createWishlistItem({
    userId: session.user.id,
    ...parsed.data,
  });

  revalidatePath("/wishlist");
}

export async function removeWishlistItem(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await deleteWishlistItem(id, session.user.id);

  revalidatePath("/wishlist");
}

export async function refreshWishlistItem(
  id: string,
  productName: string,
  category: string,
  price: number,
  stockText: string,
  stockQuantity: number | null
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const affordability = await evaluatePurchase(session.user.id, {
    itemName: productName,
    description: "Wishlist affordability check",
    category,
    price,
  });

  const stock = getStockRisk(stockText);

  await updateWishlistDecision({
    id,
    userId: session.user.id,
    affordabilityStatus: affordability.recommendation,
    affordabilityScore: affordability.score,
    affordabilityPercentage: affordability.score,
    stockStatus: stock.stockStatus,
    stockRisk: stock.stockRisk,
    stockMessage: stock.message,
    stockQuantity,
  });

  revalidatePath("/wishlist");
}