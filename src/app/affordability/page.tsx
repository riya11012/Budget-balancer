"use client";

import { useState } from "react";
import { checkAffordability } from "../../actions/affordability.action";

type Result = {
  score: number;
  recommendation: "BUY" | "DELAY" | "AVOID";
  financialImpact: string;
  reasons: string[];
  salaryAllowance: number;
  savingsAllowance: number;
  totalAllowance: number;
};

export default function AffordabilityPage() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await checkAffordability({
      itemName,
      description,
      category,
      price: Number(price),
    });

    setResult(response);
  }

  const badgeColor =
    result?.recommendation === "BUY"
      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      : result?.recommendation === "DELAY"
      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-black md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Can I Afford This?
          </h1>

          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Enter a purchase and Budget Balancer will analyze if it fits your
            salary, savings, budget, and rules.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Purchase Details
            </h2>

            <div className="mt-6 space-y-4">
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Laptop"
                className="w-full rounded-xl border p-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
                required
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="MacBook for coding and development"
                className="min-h-24 w-full rounded-xl border p-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border p-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
              >
                <option>Shopping</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Entertainment</option>
                <option>Education</option>
                <option>Other</option>
              </select>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price e.g. 50000"
                className="w-full rounded-xl border p-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
                required
              />

              <button className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                Analyze Purchase
              </button>
            </div>
          </form>

          <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {!result ? (
              <div className="flex h-full min-h-80 items-center justify-center text-center">
                <div>
                  <p className="text-5xl">💡</p>

                  <h2 className="mt-4 text-xl font-semibold text-black dark:text-white">
                    Your result will appear here
                  </h2>

                  <p className="mt-2 text-slate-500 dark:text-zinc-400">
                    Try checking a laptop, phone, trip, or course.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`rounded-xl p-4 text-center text-2xl font-bold ${badgeColor}`}
                >
                  {result.recommendation}
                </div>

                <div className="mt-6">
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Purchase Score
                  </p>

                  <p className="text-4xl font-bold text-black dark:text-white">
                    {result.score}/100
                  </p>

                  <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-3 rounded-full bg-black dark:bg-white"
                      style={{
                        width: `${result.score}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <Info
                    label="Financial Impact"
                    value={result.financialImpact}
                  />
                  <Info
                    label="Salary Allowance"
                    value={`₹${Number(result.salaryAllowance).toLocaleString(
                      "en-IN"
                    )}`}
                  />
                  <Info
                    label="Savings Allowance"
                    value={`₹${Number(result.savingsAllowance).toLocaleString(
                      "en-IN"
                    )}`}
                  />
                  <Info
                    label="Safe Spending Limit"
                    value={`₹${Number(result.totalAllowance).toLocaleString(
                      "en-IN"
                    )}`}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-black dark:text-white">
                    Why?
                  </h3>

                  <div className="mt-3 space-y-2">
                    {result.reasons.map((reason, index) => (
                      <p
                        key={index}
                        className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-black dark:text-zinc-300"
                      >
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-black">
      <span className="text-slate-500 dark:text-zinc-400">{label}</span>
      <span className="font-semibold text-black dark:text-white">{value}</span>
    </div>
  );
}