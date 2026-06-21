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

type BudgetUsageData = {
  category: string;
  spent: number;
  limit: number;
  percentUsed: number;
};

export function BudgetUsageChart({ data }: { data: BudgetUsageData[] }) {
  if (!data.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border bg-white p-6 text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No budget data yet
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-black dark:text-white">
        Budget Usage
      </h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="category"
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#94a3b8" }}
              tickLine={{ stroke: "#94a3b8" }}
            />

            <YAxis
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#94a3b8" }}
              tickLine={{ stroke: "#94a3b8" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
              }}
            />

<Bar
  dataKey="percentUsed"
  fill="#010028"
  radius={[8, 8, 0, 0]}
/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}