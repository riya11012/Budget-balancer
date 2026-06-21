import Link from "next/link";
import { auth } from "../../auth";

import {
  getDashboardSummary,
  getRecentTransactions,
  getRecentAffordabilityChecks,
  getBudgetOverview,
  getJobLossSurvivalData,
} from "../../repositories/dashboard.repository";

import {
  getIncomeExpenseData,
  getCategoryBreakdown,
  getBudgetUsageData,
} from "../../repositories/analytics.repository";

import { IncomeExpenseChart } from "../../components/charts/income-expense-chart";
import { CategoryPieChart } from "../../components/charts/category-pie-chart";
import { BudgetUsageChart } from "../../components/charts/budget-usage-chart";
import { JobLossCalculator } from "../../components/job-loss-calculator";
import { getWishlistItemsWithProgress } from "../../repositories/wishlist.repository";

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

  const jobLossData = await getJobLossSurvivalData(userId);

  const wishlist = await getWishlistItemsWithProgress(userId);

  const closestWishlistItem = wishlist
    .filter((item) => item.affordabilityPercentage < 100)
    .sort(
      (a, b) =>
        b.affordabilityPercentage - a.affordabilityPercentage
    )[0];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                Budget Balancer
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-black dark:text-white">
                Welcome back, {session.user.name || "User"}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600 dark:text-zinc-400">
                Track your money, check affordability, and know what you can buy
                before spending.
              </p>
            </div>

            <div className="flex gap-3 px-10">
              <Link
                href="/affordability"
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black"
              >
                Can I afford this?
              </Link>

              <Link
                href="/transactions"
                className="rounded-xl border px-5 py-3 text-sm font-semibold dark:border-zinc-700 dark:text-white"
              >
                Add Transaction
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Income"
            value={`₹${Number(summary.totalIncome).toLocaleString("en-IN")}`}
            subtitle="Money received"
          />

          <SummaryCard
            title="Total Expenses"
            value={`₹${Number(summary.totalExpense).toLocaleString("en-IN")}`}
            subtitle="Money spent"
          />

          <SummaryCard
            title="Net Savings"
            value={`₹${Number(summary.netSavings).toLocaleString("en-IN")}`}
            subtitle="Income minus expenses"
          />
        </section>

        {jobLossData && (
          <JobLossCalculator
            totalFunds={jobLossData.totalFunds}
            monthlyExpenses={jobLossData.monthlyExpenses}
            survivalMonths={jobLossData.survivalMonths}
          />
        )}

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Quick Decision
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-500">
                  Your core question: should you buy it?
                </p>
              </div>

              <Link
                href="/affordability"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                Check Now
              </Link>
            </div>

            {affordabilityChecks.length === 0 ? (
              <EmptyState
                title="No affordability checks yet"
                description="Check a laptop, phone, trip, or course before buying."
                href="/affordability"
                action="Run first check"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {affordabilityChecks.slice(0, 2).map((check) => (
                  <div
                    key={check.id}
                    className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-900"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold text-black dark:text-white">
                          {check.item_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-zinc-500">
                          {check.recommendation}
                        </p>
                      </div>

                      <ScoreBadge score={Number(check.score)} />
                    </div>

                    <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                      <div
                        className="h-3 rounded-full bg-black dark:bg-white"
                        style={{
                          width: `${Math.min(Number(check.score), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Closest Wishlist Goal
            </h2>

            {!closestWishlistItem ? (
              <div className="mt-5">
                <EmptyState
                  title="No wishlist goal"
                  description="Add products you want to buy and track progress."
                  href="/wishlist"
                  action="Open wishlist"
                />
              </div>
            ) : (
              <div className="mt-5">
                <p className="font-semibold text-black dark:text-white">
                  {closestWishlistItem.product_name}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                  ₹
                  {Number(closestWishlistItem.target_price).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <div className="mt-5 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-zinc-500">
                    {closestWishlistItem.affordabilityPercentage}% affordable
                  </span>

                  <span className="font-medium text-black dark:text-white">
                    ₹
                    {Number(closestWishlistItem.amountToGo).toLocaleString(
                      "en-IN"
                    )}{" "}
                    to go
                  </span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                  <div
                    className="h-3 rounded-full bg-black dark:bg-white"
                    style={{
                      width: `${closestWishlistItem.affordabilityPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-500 dark:text-zinc-500">
                  {closestWishlistItem.estimatedWeeks === 0
                    ? "You can afford this now."
                    : closestWishlistItem.estimatedWeeks !== null
                    ? `At current savings rate, in ~${closestWishlistItem.estimatedWeeks} weeks`
                    : "Add salary and rules to estimate time."}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <IncomeExpenseChart data={incomeExpenseData} />
          <CategoryPieChart data={categoryData} />
        </section>

        <BudgetUsageChart data={budgetUsageData} />

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Budget Overview
              </h2>
              <Link
                href="/budgets"
                className="text-sm font-medium text-black dark:text-white"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-4">
              {budgets.length === 0 && (
                <EmptyState
                  title="No budgets yet"
                  description="Create budgets for food, shopping, travel, and more."
                  href="/budgets"
                  action="Create budget"
                />
              )}

              {budgets.slice(0, 4).map((budget) => (
                <div key={budget.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-black dark:text-white">
                      {budget.category}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-500">
                      {budget.percentUsed}% used
                    </span>
                  </div>

                  <div className="mt-2 h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-3 rounded-full bg-black dark:bg-white"
                      style={{
                        width: `${Math.min(budget.percentUsed, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Recent Transactions
              </h2>
              <Link
                href="/transactions"
                className="text-sm font-medium text-black dark:text-white"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 && (
                <EmptyState
                  title="No transactions yet"
                  description="Add income or expenses to start tracking."
                  href="/transactions"
                  action="Add transaction"
                />
              )}

              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {tx.category}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">
                      {tx.description || "No description"}
                    </p>
                  </div>

                  <p
                    className={
                      tx.type === "income"
                        ? "font-semibold text-green-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {tx.type === "income" ? "+" : "-"}₹
                    {Number(tx.amount).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-slate-500 dark:text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-black dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
        {subtitle}
      </p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
      : score >= 50
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold ${color}`}
    >
      {score}%
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-900">
      <p className="font-medium text-black dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        {action}
      </Link>
    </div>
  );
}