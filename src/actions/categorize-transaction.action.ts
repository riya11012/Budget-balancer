"use server";

export async function predictTransactionCategory(description: string) {
  const text = description.toLowerCase();

  if (!text.trim()) {
    return { category: "", confidence: 0 };
  }

  if (
    text.includes("swiggy") ||
    text.includes("zomato") ||
    text.includes("food") ||
    text.includes("pizza") ||
    text.includes("restaurant") ||
    text.includes("burger") ||
    text.includes("coffee")
  ) {
    return { category: "Food", confidence: 95 };
  }

  if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("airport") ||
    text.includes("train") ||
    text.includes("bus") ||
    text.includes("metro") ||
    text.includes("flight")
  ) {
    return { category: "Travel", confidence: 92 };
  }

  if (
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("myntra") ||
    text.includes("shopping") ||
    text.includes("clothes")
  ) {
    return { category: "Shopping", confidence: 90 };
  }

  if (
    text.includes("netflix") ||
    text.includes("spotify") ||
    text.includes("movie") ||
    text.includes("prime") ||
    text.includes("hotstar")
  ) {
    return { category: "Entertainment", confidence: 90 };
  }

  if (
    text.includes("electricity") ||
    text.includes("wifi") ||
    text.includes("rent") ||
    text.includes("bill") ||
    text.includes("mobile recharge")
  ) {
    return { category: "Bills", confidence: 90 };
  }

  if (
    text.includes("course") ||
    text.includes("udemy") ||
    text.includes("book") ||
    text.includes("college") ||
    text.includes("exam")
  ) {
    return { category: "Education", confidence: 88 };
  }

  if (
    text.includes("doctor") ||
    text.includes("medicine") ||
    text.includes("hospital") ||
    text.includes("pharmacy")
  ) {
    return { category: "Health", confidence: 90 };
  }

  return { category: "Other", confidence: 60 };
}