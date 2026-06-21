export function getStockRisk(stockText: string) {
    const text = stockText.toLowerCase();
  
    if (
      text.includes("out of stock") ||
      text.includes("currently unavailable") ||
      text.includes("sold out")
    ) {
      return {
        stockStatus: "OUT_OF_STOCK",
        stockRisk: "HIGH",
        message: "This item is currently out of stock.",
      };
    }
  
    if (
      text.includes("only 1 left") ||
      text.includes("few left") ||
      text.includes("low stock") ||
      text.includes("limited stock")
    ) {
      return {
        stockStatus: "LOW_STOCK",
        stockRisk: "HIGH",
        message: "This item may go out of stock soon.",
      };
    }
  
    if (
      text.includes("in stock") ||
      text.includes("available")
    ) {
      return {
        stockStatus: "AVAILABLE",
        stockRisk: "LOW",
        message: "This item is currently available.",
      };
    }
  
    return {
        stockStatus: "",
        stockRisk: "",
        message: "",
      };
  }