"use client";

import { useState } from "react";
import { saveRule } from "../../actions/affordability-rule.action";

export default function AffordabilityRulesPage() {
  const [salaryPercentage, setSalaryPercentage] = useState("10");
  const [savingsPercentage, setSavingsPercentage] = useState("5");
  const [protectEmergencyFund, setProtectEmergencyFund] = useState(true);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await saveRule(
        Number(salaryPercentage),
        Number(savingsPercentage),
        protectEmergencyFund
      );

      setMessage("Rules saved successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save rules");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Affordability Rules
        </h1>

        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Set how much of your salary and savings can be used for purchases.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div>
            <label className="font-medium text-black dark:text-white">
              Salary Spending Limit (%)
            </label>

            <input
              type="number"
              value={salaryPercentage}
              onChange={(e) => setSalaryPercentage(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
            />

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Example: 10 means max 10% of monthly salary can be used.
            </p>
          </div>

          <div>
            <label className="font-medium text-black dark:text-white">
              Savings Spending Limit (%)
            </label>

            <input
              type="number"
              value={savingsPercentage}
              onChange={(e) => setSavingsPercentage(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
            />

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Example: 5 means max 5% of savings can be used.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-black dark:bg-black dark:text-white">
            <input
              type="checkbox"
              checked={protectEmergencyFund}
              onChange={(e) => setProtectEmergencyFund(e.target.checked)}
            />
            <span>Protect Emergency Fund</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Save Rules
          </button>

          {message && (
            <p className="font-medium text-black dark:text-white">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}