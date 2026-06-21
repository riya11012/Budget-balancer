import { auth } from "../../auth";
import { saveBudget } from "../../actions/budget.action";
import { getBudgetAnalysisByUserId } from "../../repositories/budget-analysis.repository";

export default async function BudgetsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-black dark:bg-black dark:text-white">
        Unauthorized
      </div>
    );
  }

  const budgets = await getBudgetAnalysisByUserId(session.user.id);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Budgets
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Set monthly limits and track spending by category.
          </p>
        </div>

        <form
          action={saveBudget}
          className="grid gap-4 rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-3"
        >
          <input
            name="category"
            placeholder="Category e.g. Food"
            className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

          <input
            name="monthlyLimit"
            type="number"
            placeholder="Monthly limit e.g. 10000"
            className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

          <button className="rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Save Budget
          </button>
        </form>

        <div className="space-y-5">
          {budgets.length === 0 && (
            <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              No budgets found. Add your first budget above.
            </div>
          )}

          {budgets.map((budget) => {
            const isOverBudget = budget.spent > budget.monthly_limit;

            return (
              <div
                key={budget.id}
                className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-black dark:text-white">
                      {budget.category}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                      ₹{Number(budget.spent).toLocaleString("en-IN")} spent of ₹
                      {Number(budget.monthly_limit).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      isOverBudget
                        ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    }`}
                  >
                    {isOverBudget ? "Over budget" : "On track"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-zinc-400">
                      {budget.percentUsed}% used
                    </span>

                    <span className="font-medium text-black dark:text-white">
                      ₹{Number(budget.remaining).toLocaleString("en-IN")} remaining
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className={`h-3 rounded-full ${
                        isOverBudget ? "bg-red-600" : "bg-black dark:bg-white"
                      }`}
                      style={{
                        width: `${Math.min(Number(budget.percentUsed), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {isOverBudget && (
                  <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
                    You exceeded this budget by ₹
                    {Math.abs(Number(budget.remaining)).toLocaleString("en-IN")}.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}