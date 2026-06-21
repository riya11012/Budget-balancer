"use client";

import { useState } from "react";

type Props = {
  totalFunds: number;
  monthlyExpenses: number;
  survivalMonths: number;
};

export function JobLossCalculator({
  totalFunds,
  monthlyExpenses,
  survivalMonths,
}: Props) {
  const [reduction, setReduction] = useState(0);

  const adjustedExpense =
    monthlyExpenses *
    (1 - reduction / 100);

  const adjustedMonths =
    adjustedExpense > 0
      ? Math.floor(totalFunds / adjustedExpense)
      : 0;

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold">
        Job Loss Survival Calculator
      </h2>

      <p className="mt-2 text-slate-500">
        If your income stopped today,
        you could survive for
      </p>

      <p className="mt-4 text-5xl font-bold">
        {adjustedMonths} months
      </p>

      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span>
            Reduce spending
          </span>

          <span>
            {reduction}%
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={50}
          value={reduction}
          onChange={(e) =>
            setReduction(
              Number(e.target.value)
            )
          }
          className="mt-3 w-full"
        />
      </div>

      

      <p className="mt-4 text-sm text-slate-500">
        Monthly expenses:
        ₹{adjustedExpense.toLocaleString("en-IN")}
      </p>
    </div>
  );
}