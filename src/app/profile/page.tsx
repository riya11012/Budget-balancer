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
  const [message, setMessage] =
    useState("");

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

  async function onSubmit(
    data: FinancialProfileInput
  ) {
    try {
      await saveFinancialProfile(data);

      setMessage(
        "Financial profile saved successfully"
      );
    } catch {
      setMessage(
        "Failed to save financial profile"
      );
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        Financial Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label>
            Monthly Salary
          </label>

          <input
            type="number"
            {...register("monthlySalary")}
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {
              errors.monthlySalary
                ?.message
            }
          </p>
        </div>

        <div>
          <label>
            Current Savings
          </label>

          <input
            type="number"
            {...register("currentSavings")}
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {
              errors.currentSavings
                ?.message
            }
          </p>
        </div>

        <div>
          <label>
            Emergency Fund
          </label>

          <input
            type="number"
            {...register("emergencyFund")}
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {
              errors.emergencyFund
                ?.message
            }
          </p>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
  );
}