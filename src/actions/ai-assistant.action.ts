"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../auth";
import ReactMarkdown from "react-markdown";
import { getFinancialProfileByUserId } from "../repositories/financial-profile.repository";
import { getTransactionsByUserId } from "../repositories/transaction.repository";
import { getBudgetAnalysisByUserId } from "../repositories/budget-analysis.repository";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function askAIAssistant(question: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const profile = await getFinancialProfileByUserId(userId);
  const transactions = await getTransactionsByUserId(userId);
  const budgets = await getBudgetAnalysisByUserId(userId);

  const transactionsText =
    transactions.length === 0
      ? "No transactions available."
      : transactions
          .slice(0, 20)
          .map(
            (tx) =>
              `${tx.type} | ${tx.category} | ₹${tx.amount} | ${
                tx.description || "No description"
              }`
          )
          .join("\n");

  const budgetsText =
    budgets.length === 0
      ? "No budgets available."
      : budgets
          .map(
            (budget) =>
              `${budget.category}: ₹${budget.spent} spent out of ₹${budget.monthly_limit}`
          )
          .join("\n");

  const prompt = `
You are Budget Balancer AI.

You are a helpful personal finance assistant.

Financial Profile:
Monthly Salary: ₹${profile?.monthly_salary || 0}
Current Savings: ₹${profile?.current_savings || 0}
Emergency Fund: ₹${profile?.emergency_fund_amount || 0}

Recent Transactions:
${transactionsText}

Budget Analysis:
${budgetsText}

User Question:
${question}

Instructions:
- Give detailed answers.
- Explain WHY.
- Mention numbers whenever possible.
- Use bullet points.
- Suggest improvements.
- Mention categories affecting finances.
- Recommend ways to save money.
- Write around 200-400 words.
- End with a short summary.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error(error);

    return `
I'm temporarily unable to reach the AI service.

Meanwhile, here's a quick summary:

• Monthly salary: ₹${profile?.monthly_salary || 0}
• Savings: ₹${profile?.current_savings || 0}
• Transactions recorded: ${transactions.length}
• Budgets created: ${budgets.length}

Please try again in a few moments.
`;
  }
}