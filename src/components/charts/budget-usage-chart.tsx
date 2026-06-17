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

export function BudgetUsageChart({
  data,
}: {
  data: BudgetUsageData[];
}) {
  if (!data.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border bg-white p-6 text-slate-500 shadow-sm">
        No budget data yet
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Budget Usage
      </h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="percentUsed"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}