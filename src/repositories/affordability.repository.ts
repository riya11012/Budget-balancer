import { getRuleByUserId } from "./affordability-rule.repository";
import { getFinancialProfileByUserId } from "./financial-profile.repository";
import { saveAffordabilityCheck} from "./affordability-check.repository";

type PurchaseInput = {
  itemName: string;
  description?: string;
  category: string;
  price: number;
};

type Recommendation = "BUY" | "DELAY" | "AVOID";

export async function evaluatePurchase(userId: string, purchase: PurchaseInput) {
  const profile = await getFinancialProfileByUserId(userId);
  const rule = await getRuleByUserId(userId);

  if (!profile || !rule) {
    throw new Error("Financial profile or rules missing");
  }

  const monthlySalary = Number(profile.monthly_salary);
  const currentSavings = Number(profile.current_savings);
  const emergencyFund = Number(profile.emergency_fund);

  const salaryAllowance =
    monthlySalary * (Number(rule.salary_percentage) / 100);

  const savingsAllowance =
    currentSavings * (Number(rule.savings_percentage) / 100);

  const availableSavingsAfterEmergency = Math.max(
    0,
    currentSavings - emergencyFund
  );

  const safeSavingsAllowance = Math.min(
    savingsAllowance,
    availableSavingsAfterEmergency
  );

  const totalAllowance = salaryAllowance + safeSavingsAllowance;

  const score = calculateScore(purchase.price, totalAllowance);
  const recommendation = generateRecommendation(score);
  const financialImpact = getFinancialImpact(score);

  const reasons = generateReasons({
    price: purchase.price,
    salaryAllowance,
    savingsAllowance: safeSavingsAllowance,
    totalAllowance,
    monthlySalary,
    currentSavings,
    emergencyFund,
  });

  await saveAffordabilityCheck({
    userId,
    itemName: purchase.itemName,
    description: purchase.description || "",
    category: purchase.category,
    price: purchase.price,
    score,
    recommendation,
    financialImpact,
    reasons,
    salaryAllowance,
    savingsAllowance: safeSavingsAllowance,
    totalAllowance,
  });

  return {
    itemName: purchase.itemName,
    description: purchase.description || "",
    category: purchase.category,
    price: purchase.price,
    score,
    recommendation,
    financialImpact,
    reasons,
    salaryAllowance,
    savingsAllowance: safeSavingsAllowance,
    totalAllowance,
  };
}

export function calculateScore(price: number, totalAllowance: number) {
  if (price <= 0) return 0;

  const rawScore = (totalAllowance / price) * 100;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function generateRecommendation(score: number): Recommendation {
  if (score >= 80) return "BUY";
  if (score >= 50) return "DELAY";
  return "AVOID";
}

function getFinancialImpact(score: number) {
  if (score >= 80) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

function generateReasons(data: {
  price: number;
  salaryAllowance: number;
  savingsAllowance: number;
  totalAllowance: number;
  monthlySalary: number;
  currentSavings: number;
  emergencyFund: number;
}) {
  const reasons: string[] = [];

  if (data.price <= data.totalAllowance) {
    reasons.push("This purchase is within your safe spending allowance.");
  } else {
    reasons.push("This purchase exceeds your safe spending allowance.");
  }

  if (data.price <= data.salaryAllowance) {
    reasons.push("It fits within your salary-based purchase limit.");
  } else {
    reasons.push("It exceeds your salary-based purchase limit.");
  }

  if (data.currentSavings - data.price >= data.emergencyFund) {
    reasons.push("Your emergency fund remains protected.");
  } else {
    reasons.push("This purchase may affect your emergency fund.");
  }

  return reasons;
}