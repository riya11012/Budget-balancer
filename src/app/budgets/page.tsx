import { auth } from "@/src/auth";

import {
  getBudgetAnalysisByUserId,
} from "../../repositories/budget-analysis.repository";

export default async function BudgetsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-10">
        Unauthorized
      </div>
    );
  }

  const budgets: {
    id: string;
    monthly_limit: number;
    spent: number;
    remaining: number;
    percentUsed: number;
    category: string; // Added category property
  }[] = await getBudgetAnalysisByUserId(
    session.user.id
  );

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Budget Analysis
      </h1>

      <div className="space-y-6">
        {budgets.length === 0 && (
          <p>No budgets found.</p>
        )}

        {budgets.map((budget) => {
          const isOverBudget =
            budget.spent >
            budget.monthly_limit;

          return (
            <div
              key={budget.id}
              className="border rounded-lg p-6"
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">
                  {budget.category}
                </h2>

                <span>
                  {budget.percentUsed}%
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p>
                  Budget: ₹
                  {budget.monthly_limit}
                </p>

                <p>
                  Spent: ₹
                  {budget.spent}
                </p>

                <p>
                  Remaining: ₹
                  {budget.remaining}
                </p>

                {isOverBudget ? (
                  <p className="text-red-600 font-medium">
                    Over Budget by ₹
                    {Math.abs(
                      budget.remaining
                    )}
                  </p>
                ) : (
                  <p className="text-green-600 font-medium">
                    Within Budget
                  </p>
                )}
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded h-3">
                  <div
                    className={`h-3 rounded ${
                      budget.percentUsed <
                      80
                        ? "bg-green-500"
                        : budget.percentUsed <=
                          100
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        budget.percentUsed,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}