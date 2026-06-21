"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type IncomeExpenseData = {
  name: string;
  amount: number;
};

export function IncomeExpenseChart({
  data,
}: {
  data: IncomeExpenseData[];
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
  <h2 className="text-xl font-semibold text-black dark:text-white">
    Income vs Expense
  </h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
<XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
<YAxis tick={{ fill: "#94a3b8" }} />
<Tooltip
  contentStyle={{
    backgroundColor:
      document.documentElement.classList.contains("dark")
        ? "#18181b"
        : "#ffffff",
    border: "1px solid #d4d4d8",
    borderRadius: "12px",
  }}
  labelStyle={{
    color:
      document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#0f172a",
  }}
  itemStyle={{
    color:
      document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#0f172a",
  }}
/>
<Bar
  dataKey="amount"
  fill="#010028"
  radius={[8, 8, 0, 0]}
/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}