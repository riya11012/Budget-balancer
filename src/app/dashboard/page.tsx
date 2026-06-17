import { auth } from "@/src/auth";

import {
  getDashboardSummary,
  getRecentTransactions,
  getRecentAffordabilityChecks,
  getBudgetOverview,
} from "@/src/repositories/dashboard.repository";

import {
  getIncomeExpenseData,
  getCategoryBreakdown,
  getBudgetUsageData,
} from "@/src/repositories/analytics.repository";

import { IncomeExpenseChart } from "@/src/components/charts/income-expense-chart";
import { CategoryPieChart } from "@/src/components/charts/category-pie-chart";
import { BudgetUsageChart } from "@/src/components/charts/budget-usage-chart";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";


export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-10">Unauthorized</div>;
  }

  const userId = session.user.id;

  const summary = await getDashboardSummary(userId);
  const transactions = await getRecentTransactions(userId);
  const affordabilityChecks = await getRecentAffordabilityChecks(userId);
  const budgets = await getBudgetOverview(userId);

  const incomeExpenseData = await getIncomeExpenseData(userId);
  const categoryData = await getCategoryBreakdown(userId);
  const budgetUsageData = await getBudgetUsageData(userId);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600">
            Welcome back, {session.user.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Total Income" value={`₹${summary.totalIncome}`} />
          <Card title="Total Expenses" value={`₹${summary.totalExpense}`} />
          <Card title="Net Savings" value={`₹${summary.netSavings}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <IncomeExpenseChart data={incomeExpenseData} />
          <CategoryPieChart data={categoryData} />
        </div>

        <BudgetUsageChart data={budgetUsageData} />

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>

          <div className="space-y-4">
            {budgets.length === 0 && <p>No budgets found.</p>}

            {budgets.map((budget: { id: Key | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; percentUsed: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
              <div key={budget.id}>
                <div className="flex justify-between">
                  <span>{budget.category}</span>
                  <span>{budget.percentUsed}% used</span>
                </div>

                <div className="mt-2 h-3 rounded bg-slate-200">
                  <div
                    className="h-3 rounded bg-black"
                    style={{
                      width: `${Math.min(Number(budget.percentUsed) || 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Recent Transactions
            </h2>

            <div className="space-y-3">
              {transactions.length === 0 && <p>No transactions found.</p>}

              {transactions.map((tx: { id: Key | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: any; type: string; amount: any; }) => (
                <div
                  key={tx.id}
                  className="flex justify-between rounded-xl bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium">{tx.category}</p>
                    <p className="text-sm text-slate-500">
                      {tx.description || "No description"}
                    </p>
                  </div>

                  <p>
                    {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Recent Affordability Checks
            </h2>

            <div className="space-y-3">
              {affordabilityChecks.length === 0 && (
                <p>No affordability checks found.</p>
              )}

              {affordabilityChecks.map((check: { id: Key | null | undefined; item_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; recommendation: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; score: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <div
                  key={check.id}
                  className="flex justify-between rounded-xl bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium">{check.item_name}</p>
                    <p className="text-sm text-slate-500">
                      {check.recommendation}
                    </p>
                  </div>

                  <p>{check.score}/100</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}