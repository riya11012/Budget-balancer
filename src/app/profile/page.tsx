"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  financialProfileSchema,
  FinancialProfileInput,
} from "../../schemas/financial-profile.schema";

import { saveFinancialProfile } from "../../actions/financial-profile.action";

export default function ProfilePage() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinancialProfileInput>({
    resolver: zodResolver(financialProfileSchema),
    defaultValues: {
      monthlySalary: 0,
      currentSavings: 0,
      emergencyFund: 0,
    },
  });

  async function onSubmit(data: FinancialProfileInput) {
    try {
      await saveFinancialProfile(data);
      setMessage("Financial profile saved successfully");
    } catch {
      setMessage("Failed to save financial profile");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Financial Profile
          </h1>

          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Add your salary, savings, and emergency fund to power affordability
            decisions.
          </p>
        </div>

        <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
>
          <div>
            <label className="font-medium text-black dark:text-white">
              Monthly Salary
            </label>

            <input
              type="number"
              {...register("monthlySalary")}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            />

            {errors.monthlySalary && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.monthlySalary.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium text-black dark:text-white">
              Current Savings
            </label>

            <input
              type="number"
              {...register("currentSavings")}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            />

            {errors.currentSavings && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.currentSavings.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium text-black dark:text-white">
              Emergency Fund
            </label>

            <input
              type="number"
              {...register("emergencyFund")}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            />

            {errors.emergencyFund && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.emergencyFund.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Save Profile
            </button>
          </div>
        </form>

        {message && (
          <div className="rounded-xl border bg-white p-4 text-slate-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}